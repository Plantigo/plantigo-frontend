import Capacitor
import NetworkExtension
import SystemConfiguration.CaptiveNetwork

@objc(SSIDPlugin)
public class SSIDPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SSIDPlugin"
    public let jsName = "SSID"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getSSID", returnType: CAPPluginReturnPromise)
    ]

    @objc func getSSID(_ call: CAPPluginCall) {
        Task {
            if let ssid = await self.getCurrentWiFiSSID() {
                call.resolve(["ssid": ssid])
            } else {
                call.reject("Nie udało się odczytać SSID.")
            }
        }
    }

    private func getCurrentWiFiSSID() async -> String? {
        if #available(iOS 14.0, *) {
            if let interfaces = await NEHotspotNetwork.fetchCurrent() {
                return interfaces.ssid
            }
        } else {
            // Dla starszych wersji iOS użyj CNCopySupportedInterfaces
            if let interfaces = CNCopySupportedInterfaces() as? [String] {
                for interface in interfaces {
                    if let interfaceInfo = CNCopyCurrentNetworkInfo(interface as CFString) as? [String: Any] {
                        if let ssid = interfaceInfo[kCNNetworkInfoKeySSID as String] as? String {
                            return ssid
                        }
                    }
                }
            }
        }
        return nil
    }
}
