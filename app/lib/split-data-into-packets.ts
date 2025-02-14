export function splitDataIntoPackets(
  data: string,
  startByte: string,
  endByte: string,
  maxPacketSize: number = 20
): string[] {
  // Konwersja danych na typ Uint8Array (bajty)
  const dataBytes = new TextEncoder().encode(data);

  // Rozmiary danych w pierwszej i ostatniej paczce
  const maxDataFirst = maxPacketSize - 1; // Zostawiamy miejsce na `startByte`
  const maxDataLast = maxPacketSize - 1; // Zostawiamy miejsce na `endByte`

  // Dane do pierwszej paczki
  const firstPacketData = dataBytes.slice(0, maxDataFirst);
  const remainingData = dataBytes.slice(maxDataFirst);

  // Dane do ostatniej paczki
  let lastPacketData: Uint8Array;
  let middlePacketsData: Uint8Array;

  if (remainingData.length > maxDataLast) {
    lastPacketData = remainingData.slice(-maxDataLast);
    middlePacketsData = remainingData.slice(0, -maxDataLast);
  } else {
    lastPacketData = remainingData;
    middlePacketsData = new Uint8Array();
  }

  // Podział danych na paczki pośrednie
  const middlePackets: Uint8Array[] = [];
  for (let i = 0; i < middlePacketsData.length; i += maxPacketSize) {
    middlePackets.push(middlePacketsData.slice(i, i + maxPacketSize));
  }

  // Dodanie bajtów specjalnych
  const packets: Uint8Array[] = [];
  packets.push(
    concatUint8Arrays([new TextEncoder().encode(startByte), firstPacketData])
  ); // Pierwsza paczka
  packets.push(...middlePackets); // Paczki pośrednie
  packets.push(
    concatUint8Arrays([lastPacketData, new TextEncoder().encode(endByte)])
  ); // Ostatnia paczka

  // Konwersja do formatu HEX
  const packetsHex = packets.map((packet) => bufferToHex(packet));
  return packetsHex;
}

// Funkcja pomocnicza do łączenia Uint8Arrays
function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  arrays.forEach((arr) => {
    result.set(arr, offset);
    offset += arr.length;
  });
  return result;
}

// Funkcja pomocnicza do konwersji Uint8Array na HEX
function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Przykład użycia
//   const data = "ssid=Orange_Swiatlowod_E4C0_2.4GHz,password=";
export const START_BYTE = "\x02";
export const END_BYTE = "\x03";
