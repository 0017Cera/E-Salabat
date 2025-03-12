#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "FRAMSI";
const char* password = "12345678";

// Pin Definitions
#define WATER_LEVEL_PIN 34     // Water level sensor (analog)
#define PUMP_PIN 14            // Pump control pin
#define HEATER_PIN 27          // Heater control pin
#define MIXER_PIN 26           // Mixer control pin

// Water Level Calibration
const int WATER_LEVEL_MAX = 4095;   // Maximum possible reading
const int WATER_LEVEL_THRESHOLD = 700;  // Reading for 50% level

// Objects
WebServer server(80);

// Variables
int waterLevel = 0;
bool pumpStatus = false;
bool heaterStatus = false;
int mixerSpeed = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("\nStarting ESP32 Fluid Control Unit...");
  
  // Initialize pins
  pinMode(WATER_LEVEL_PIN, INPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(HEATER_PIN, OUTPUT);
  pinMode(MIXER_PIN, OUTPUT);
  
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
  
  // Set initial states
  digitalWrite(PUMP_PIN, LOW);
  digitalWrite(HEATER_PIN, LOW);
  analogWrite(MIXER_PIN, 0);
  
  // Connect to WiFi
  Serial.print("Connecting to WiFi network: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected successfully!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  setupEndpoints();
  server.enableCORS();
  server.begin();
  
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  updateSensors();
  delay(100);
}

void updateSensors() {
  // Update water level
  int rawWaterLevel = analogRead(WATER_LEVEL_PIN);
  
  if (rawWaterLevel < WATER_LEVEL_THRESHOLD) {
    waterLevel = 50;
  } else {
    waterLevel = map(rawWaterLevel, WATER_LEVEL_THRESHOLD, WATER_LEVEL_MAX, 50, 100);
    waterLevel = constrain(waterLevel, 50, 100);
  }
  
  // Debug output
  Serial.printf("Water Level: %d%%, Pump: %s, Heater: %s, Mixer: %d\n",
    waterLevel,
    pumpStatus ? "ON" : "OFF",
    heaterStatus ? "ON" : "OFF",
    mixerSpeed
  );
}

void setupEndpoints() {
  // Get sensor data endpoint
  server.on("/sensors", HTTP_GET, []() {
    DynamicJsonDocument doc(200);
    doc["waterLevel"] = waterLevel;
    doc["pumpStatus"] = pumpStatus;
    doc["heaterStatus"] = heaterStatus;
    doc["mixerSpeed"] = mixerSpeed;
    
    String response;
    serializeJson(doc, response);
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    
    server.send(200, "application/json", response);
  });

  // Control pump
  server.on("/control/pump", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      DynamicJsonDocument doc(200);
      deserializeJson(doc, server.arg("plain"));
      pumpStatus = doc["status"].as<bool>();
      digitalWrite(PUMP_PIN, pumpStatus ? HIGH : LOW);
      server.send(200, "application/json", "{\"success\":true}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
    }
  });

  // Control heater
  server.on("/control/heater", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      DynamicJsonDocument doc(200);
      deserializeJson(doc, server.arg("plain"));
      heaterStatus = doc["status"].as<bool>();
      digitalWrite(HEATER_PIN, heaterStatus ? HIGH : LOW);
      server.send(200, "application/json", "{\"success\":true}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
    }
  });

  // Control mixer speed
  server.on("/control/mixer", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      DynamicJsonDocument doc(200);
      deserializeJson(doc, server.arg("plain"));
      mixerSpeed = doc["speed"].as<int>();
      int pwmValue = map(mixerSpeed, 0, 5, 0, 255);
      analogWrite(MIXER_PIN, pwmValue);
      server.send(200, "application/json", "{\"success\":true}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
    }
  });

  // Handle OPTIONS requests
  server.on("/sensors", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200);
  });
} 