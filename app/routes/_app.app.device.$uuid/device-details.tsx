import { useEffect, useState } from "react";
import {
  Wifi,
  WifiOff,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XIcon,
  GripIcon,
  Loader2Icon,
} from "lucide-react";
import { Device, DiagramItem, deviceActions } from "@/actions/devices";
import { type PaginatedResponse, type Telemetry } from "@/actions/telemetry";
import MoistureDiagram from "./moisture-diagram";
import TemperatureDiagram from "./temperature-diagram";
import HumidityDiagram from "./humidity-diagram";
import PressureDiagram from "./pressure-diagram";
import {
  useFetcher,
  useSubmit,
  useNavigation,
  useActionData,
} from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  DragMoveEvent,
  MeasuringStrategy,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DeviceDetailsProps {
  device: Device;
  telemetry: PaginatedResponse<Telemetry>;
  dashboardLayout?: DiagramItem[];
}

// Define diagram types
type DiagramType = "temperature" | "moisture" | "humidity" | "pressure";

// Define action data type
interface SaveLayoutActionData {
  success: boolean;
  layout?: DiagramItem[];
  error?: string;
  _action?: string;
}

// Custom drop animation configuration
const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

// Custom modifier to constrain movement to a single axis
function restrictToSingleAxis(
  { transform }: { transform: { x: number; y: number } },
  { initialCoordinates, currentCoordinates }: any
) {
  // Calculate the distance moved in each axis
  const deltaX = Math.abs(currentCoordinates.x - initialCoordinates.x);
  const deltaY = Math.abs(currentCoordinates.y - initialCoordinates.y);

  // If moving more horizontally than vertically, restrict to X-axis
  if (deltaX > deltaY) {
    return {
      ...transform,
      y: 0,
    };
  }

  // Otherwise, restrict to Y-axis
  return {
    ...transform,
    x: 0,
  };
}

// Sortable diagram card component
function SortableDiagramCard({
  id,
  type,
  latestTelemetry,
  handleRefresh,
  isRefreshing,
  isEditMode,
  onRemove,
}: {
  id: string;
  type: DiagramType;
  latestTelemetry: Telemetry | undefined;
  handleRefresh: () => void;
  isRefreshing: boolean;
  isEditMode: boolean;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: {
      duration: 250, // Slightly faster for more responsive feel
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
    ...(isDragging && { scale: "0.98" }),
  };

  const renderDiagram = () => {
    switch (type) {
      case "temperature":
        return (
          <>
            <CardHeader className={isEditMode ? "pt-14" : undefined}>
              <CardTitle>Temperature</CardTitle>
              <CardDescription>Current temperature reading</CardDescription>
            </CardHeader>
            <CardContent>
              <TemperatureDiagram
                temperature={latestTelemetry?.temperature}
                lastMeasuredAt={
                  latestTelemetry
                    ? new Date(latestTelemetry.timestamp)
                    : undefined
                }
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            </CardContent>
          </>
        );
      case "moisture":
        return (
          <>
            <CardHeader className={isEditMode ? "pt-14" : undefined}>
              <CardTitle>Soil Moisture</CardTitle>
              <CardDescription>
                Current moisture level in the soil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoistureDiagram
                moisture={latestTelemetry?.soil_moisture}
                lastMeasuredAt={
                  latestTelemetry
                    ? new Date(latestTelemetry.timestamp)
                    : undefined
                }
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            </CardContent>
          </>
        );
      case "humidity":
        return (
          <>
            <CardHeader className={isEditMode ? "pt-14" : undefined}>
              <CardTitle>Humidity</CardTitle>
              <CardDescription>Current air humidity level</CardDescription>
            </CardHeader>
            <CardContent>
              <HumidityDiagram
                humidity={latestTelemetry?.humidity}
                lastMeasuredAt={
                  latestTelemetry
                    ? new Date(latestTelemetry.timestamp)
                    : undefined
                }
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            </CardContent>
          </>
        );
      case "pressure":
        return (
          <>
            <CardHeader className={isEditMode ? "pt-14" : undefined}>
              <CardTitle>Atmospheric Pressure</CardTitle>
              <CardDescription>Current atmospheric pressure</CardDescription>
            </CardHeader>
            <CardContent>
              <PressureDiagram
                pressure={latestTelemetry?.pressure}
                lastMeasuredAt={
                  latestTelemetry
                    ? new Date(latestTelemetry.timestamp)
                    : undefined
                }
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-full",
        isEditMode && "relative",
        isDragging && "shadow-lg border-2 border-primary"
      )}
    >
      {isEditMode && (
        <>
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-3 -top-3 h-12 w-12 rounded-full z-10"
            onClick={() => onRemove(id)}
          >
            <TrashIcon className="h-6 w-6" />
          </Button>
          <div
            {...attributes}
            {...listeners}
            className="absolute left-3 top-3 h-8 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing z-10 bg-background rounded-md touch-action-none hover:bg-muted transition-colors"
            style={{ touchAction: "none" }}
          >
            <GripIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </>
      )}
      {renderDiagram()}
    </Card>
  );
}

export function DeviceDetails({
  device,
  telemetry: initialTelemetry,
  dashboardLayout: initialDashboardLayout,
}: DeviceDetailsProps) {
  // Define the type for the telemetry refresh action data
  interface TelemetryRefreshActionData {
    success: boolean;
    telemetry?: PaginatedResponse<Telemetry>;
    error?: string;
    _action: string;
  }

  const fetcher = useFetcher<TelemetryRefreshActionData>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<SaveLayoutActionData>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDiagramOptions, setShowDiagramOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragAxis, setDragAxis] = useState<"x" | "y" | null>(null);
  const [initialPosition, setInitialPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Use fetcher data if it's a telemetry refresh, otherwise use initialTelemetry
  const [telemetryData, setTelemetryData] =
    useState<PaginatedResponse<Telemetry>>(initialTelemetry);

  // Update telemetry data when fetcher returns new data
  useEffect(() => {
    if (
      fetcher.data?.success &&
      fetcher.data?._action === "refreshTelemetry" &&
      fetcher.data?.telemetry
    ) {
      setTelemetryData(fetcher.data.telemetry);
    }
  }, [fetcher.data]);

  // Update telemetry data when initialTelemetry changes
  useEffect(() => {
    setTelemetryData(initialTelemetry);
  }, [initialTelemetry]);

  const latestTelemetry = telemetryData.results[0];

  // Use action data for layout if available (from POST response)
  const [diagrams, setDiagrams] = useState<DiagramItem[]>(
    initialDashboardLayout || [
      { id: "temperature-diagram", type: "temperature" },
      { id: "moisture-diagram", type: "moisture" },
    ]
  );

  // Update diagrams if we get action data back
  useEffect(() => {
    if (actionData?.success && actionData?.layout) {
      setDiagrams(actionData.layout);
    }
  }, [actionData]);

  // Update diagrams if we get new data from the server
  useEffect(() => {
    if (initialDashboardLayout && !actionData?.layout) {
      setDiagrams(initialDashboardLayout);
    }
  }, [initialDashboardLayout, actionData]);

  // Set up DnD sensors with improved sensitivity
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Slightly increased to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetcher.submit(
      { _action: "refreshTelemetry" },
      { method: "post", action: `/app/device/${device.uuid}` }
    );
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // If we're exiting edit mode, save the layout
      handleSaveLayout();
    } else {
      setIsEditMode(true);
    }
    setShowDiagramOptions(false);
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    setInitialPosition({
      x: event.active.rect.current.translated?.left || 0,
      y: event.active.rect.current.translated?.top || 0,
    });
    setDragAxis(null); // Reset axis at start of drag
  };

  // Handle drag move to determine axis
  const handleDragMove = (event: DragMoveEvent) => {
    if (!initialPosition || dragAxis) return;

    const currentPosition = {
      x: event.active.rect.current.translated?.left || 0,
      y: event.active.rect.current.translated?.top || 0,
    };

    const deltaX = Math.abs(currentPosition.x - initialPosition.x);
    const deltaY = Math.abs(currentPosition.y - initialPosition.y);

    // Only set the axis once we have a clear direction (after some movement)
    if (deltaX > 5 || deltaY > 5) {
      setDragAxis(deltaX > deltaY ? "x" : "y");
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    setDragAxis(null);
    setInitialPosition(null);

    const { active, over } = event;

    if (over && active.id !== over.id) {
      setDiagrams((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveDiagram = (id: string) => {
    setDiagrams((items) => items.filter((item) => item.id !== id));
  };

  const handleAddDiagram = (type: DiagramType) => {
    // Check if a diagram of this type already exists
    const diagramExists = diagrams.some((diagram) => diagram.type === type);

    // Only add if this type doesn't already exist
    if (!diagramExists) {
      // Generate a proper UUID for the diagram
      const newId = `${type}-${uuidv4()}`;
      // Add the new diagram at the beginning of the array
      setDiagrams((items) => [{ id: newId, type }, ...items]);
    }

    setShowDiagramOptions(false);
  };

  // Function to check if a diagram type already exists
  const isDiagramTypeUsed = (type: DiagramType): boolean => {
    return diagrams.some((diagram) => diagram.type === type);
  };

  const handleSaveLayout = () => {
    setIsSaving(true);

    // Create a FormData object with the layout data
    const formData = new FormData();
    formData.append("_action", "saveDashboardLayout");
    formData.append("layout", JSON.stringify(diagrams));

    // Submit the form with optimistic UI update
    // Use preventScrollReset and replace to avoid a full page reload
    submit(formData, {
      method: "post",
      replace: true,
      preventScrollReset: true,
      // This is crucial - it prevents the automatic GET request after the action
      navigate: false,
    });

    // Small delay to show the saving state
    setTimeout(() => {
      setIsSaving(false);
      setIsEditMode(false);
    }, 500);
  };

  // Check if the action is complete and update UI accordingly
  useEffect(() => {
    if (navigation.state === "idle" && isSaving) {
      setIsSaving(false);
      setIsEditMode(false);
    }
  }, [navigation.state, isSaving]);

  useEffect(() => {
    const interval = setInterval(handleRefresh, 60 * 1000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  // Custom modifier function based on current drag axis
  const modifiers = dragAxis
    ? [
        ({
          transform,
        }: {
          transform: { x: number; y: number; scaleX: number; scaleY: number };
        }) => ({
          ...transform,
          x: dragAxis === "x" ? transform.x : 0,
          y: dragAxis === "y" ? transform.y : 0,
        }),
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold mb-2">{device.name}</h1>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-background/50 w-fit">
          {device.is_active ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Disconnected</span>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end mb-2">
        <Button
          variant={isEditMode ? "default" : "outline"}
          className="flex items-center gap-2"
          onClick={toggleEditMode}
          disabled={isSaving}
        >
          {isEditMode ? (
            <>
              {isSaving ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <XIcon className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Done"}
            </>
          ) : (
            <>
              <PencilIcon className="h-4 w-4" />
              Edit dashboard
            </>
          )}
        </Button>
      </div>

      {isEditMode && (
        <div className="space-y-4 relative z-20">
          {!showDiagramOptions ? (
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2 border-dashed"
              onClick={() => setShowDiagramOptions(true)}
              // Disable the button if all diagram types are already used
              disabled={
                isDiagramTypeUsed("temperature") &&
                isDiagramTypeUsed("moisture") &&
                isDiagramTypeUsed("humidity") &&
                isDiagramTypeUsed("pressure")
              }
            >
              <PlusIcon className="h-4 w-4" />
              Add diagram
            </Button>
          ) : (
            <div className="bg-background border rounded-md p-4 space-y-2">
              <h3 className="text-sm font-medium mb-2">Select diagram type</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAddDiagram("temperature")}
                  className="justify-start"
                  disabled={isDiagramTypeUsed("temperature")}
                >
                  Temperature
                  {isDiagramTypeUsed("temperature") && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Added)
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddDiagram("moisture")}
                  className="justify-start"
                  disabled={isDiagramTypeUsed("moisture")}
                >
                  Moisture
                  {isDiagramTypeUsed("moisture") && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Added)
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddDiagram("humidity")}
                  className="justify-start"
                  disabled={isDiagramTypeUsed("humidity")}
                >
                  Humidity
                  {isDiagramTypeUsed("humidity") && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Added)
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddDiagram("pressure")}
                  className="justify-start"
                  disabled={isDiagramTypeUsed("pressure")}
                >
                  Pressure
                  {isDiagramTypeUsed("pressure") && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Added)
                    </span>
                  )}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => setShowDiagramOptions(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        modifiers={modifiers}
      >
        <SortableContext
          items={diagrams.map((d) => d.id)}
          strategy={
            dragAxis === "x"
              ? horizontalListSortingStrategy
              : verticalListSortingStrategy
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-0">
            {diagrams.map((diagram) => (
              <SortableDiagramCard
                key={diagram.id}
                id={diagram.id}
                type={diagram.type}
                latestTelemetry={latestTelemetry}
                handleRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                isEditMode={isEditMode}
                onRemove={handleRemoveDiagram}
              />
            ))}
          </div>
        </SortableContext>

        {/* Add DragOverlay for improved visual feedback */}
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeDragId ? (
            <div className="opacity-80 shadow-xl rounded-lg border border-primary">
              <Card className="w-full">
                {(() => {
                  const diagram = diagrams.find((d) => d.id === activeDragId);
                  if (!diagram) return null;

                  switch (diagram.type) {
                    case "temperature":
                      return (
                        <>
                          <CardHeader className="pt-14">
                            <CardTitle>Temperature</CardTitle>
                            <CardDescription>
                              Current temperature reading
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center">
                              <span className="text-2xl font-semibold text-primary">
                                Temperature Diagram
                              </span>
                            </div>
                          </CardContent>
                        </>
                      );
                    case "moisture":
                      return (
                        <>
                          <CardHeader className="pt-14">
                            <CardTitle>Soil Moisture</CardTitle>
                            <CardDescription>
                              Current moisture level in the soil
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center">
                              <span className="text-2xl font-semibold text-primary">
                                Moisture Diagram
                              </span>
                            </div>
                          </CardContent>
                        </>
                      );
                    case "humidity":
                      return (
                        <>
                          <CardHeader className="pt-14">
                            <CardTitle>Humidity</CardTitle>
                            <CardDescription>
                              Current air humidity level
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center">
                              <span className="text-2xl font-semibold text-primary">
                                Humidity Diagram
                              </span>
                            </div>
                          </CardContent>
                        </>
                      );
                    case "pressure":
                      return (
                        <>
                          <CardHeader className="pt-14">
                            <CardTitle>Atmospheric Pressure</CardTitle>
                            <CardDescription>
                              Current atmospheric pressure
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center">
                              <span className="text-2xl font-semibold text-primary">
                                Pressure Diagram
                              </span>
                            </div>
                          </CardContent>
                        </>
                      );
                    default:
                      return null;
                  }
                })()}
              </Card>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
