#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "Paload_ka_sakin";
const char* password = "payetang";

// Pin Definitions
#define GRINDER_RELAY_PIN 16
#define VALVE_RELAY_PIN 17

// Objects
WebServer server(80);

// Variables
bool grinderStatus = false;
bool valveStatus = false;

void setup() {
  Serial.begin(115200);
  Serial.println("\nStarting ESP32 Grinder & Valve Test...");

  // Initialize relay pins
  pinMode(GRINDER_RELAY_PIN, OUTPUT);
  pinMode(VALVE_RELAY_PIN, OUTPUT);
  digitalWrite(GRINDER_RELAY_PIN, HIGH); // Relay is active LOW (OFF)
  digitalWrite(VALVE_RELAY_PIN, HIGH);   // Relay is active LOW (OFF)

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ Connected to WiFi");
  Serial.print("📌 IP Address: ");
  Serial.println(WiFi.localIP());

  // Setup endpoints
  setupEndpoints();
  server.begin();
  Serial.println("🌐 HTTP server started");
}

void loop() {
  server.handleClient();
  
  // Print status every 2 seconds
  static unsigned long lastPrint = 0;
  if (millis() - lastPrint >= 2000) {
    Serial.printf("\n--- Status Update ---\n");
    Serial.printf("Grinder: %s\n", grinderStatus ? "ON" : "OFF");
    Serial.printf("Valve: %s\n", valveStatus ? "ON" : "OFF");
    Serial.printf("------------------\n");
    lastPrint = millis();
  }
}

void setupEndpoints() {
  // Get sensor data endpoint (matches getSensorData in api.ts)
  server.on("/sensors", HTTP_GET, []() {
    Serial.println("\n📡 Sensor data request received");
    
    DynamicJsonDocument doc(200);
    doc["grinderStatus"] = grinderStatus;
    doc["valveStatus"] = valveStatus;
    doc["temperature"] = 0; // Placeholder since we're not using temperature in this test
    
    String response;
    serializeJson(doc, response);
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", response);
    Serial.println("📤 Sensor data sent: " + response);
  });

  // Control grinder endpoint (matches toggleGrinder in api.ts)
  server.on("/control/grinder", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      DynamicJsonDocument doc(200);
      deserializeJson(doc, server.arg("plain"));
      
      // Handle both status and speed formats
      if (doc.containsKey("status")) {
        grinderStatus = doc["status"].as<bool>();
        digitalWrite(GRINDER_RELAY_PIN, !grinderStatus); // Relay is active LOW
        Serial.printf("⚙️ Grinder set to: %s\n", grinderStatus ? "ON" : "OFF");
      } else if (doc.containsKey("speed")) {
        int speed = doc["speed"].as<int>();
        grinderStatus = (speed > 0);
        digitalWrite(GRINDER_RELAY_PIN, !grinderStatus); // Relay is active LOW
        Serial.printf("⚙️ Grinder speed set to: %d (Status: %s)\n", speed, grinderStatus ? "ON" : "OFF");
      }
      
      server.send(200, "application/json", "{\"success\":true}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
    }
  });

  // Control valve endpoint (matches toggleValve in api.ts)
  server.on("/control/valve", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      DynamicJsonDocument doc(200);
      deserializeJson(doc, server.arg("plain"));
      valveStatus = doc["status"].as<bool>();
      
      digitalWrite(VALVE_RELAY_PIN, !valveStatus); // Relay is active LOW
      
      Serial.printf("🚰 Valve set to: %s\n", valveStatus ? "ON" : "OFF");
      server.send(200, "application/json", "{\"success\":true}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
    }
  });

  // Handle CORS
  server.on("/sensors", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200);
  });

  server.on("/control/grinder", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200);
  });

  server.on("/control/valve", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200);
  });
} 