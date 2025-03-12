#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ESP32Servo.h>

// WiFi credentials
const char* ssid = "FRAMSI";       // Replace with your actual WiFi name
const char* password = "12345678"; // Replace with your actual WiFi password

// Pin Definitions
#define TEMP_SENSOR_PIN 4      // DS18B20 temperature sensor
#define WATER_LEVEL_PIN 34     // Water level sensor (analog)
#define GRINDER_SERVO_PIN 12   // Servo motor for grinder
#define JUICER_SERVO_PIN 13    // Servo motor for juicer
#define PUMP_PIN 14            // Pump control pin

// Water Level Calibration
const int WATER_LEVEL_MAX = 4095;   // Maximum possible reading
const int WATER_LEVEL_MIN = 1365;   // ~1/3 of max (adjust based on your sensor)
const int WATER_LEVEL_THRESHOLD = 700;  // Reading for 50% level

// Objects
WebServer server(80);
OneWire oneWire(TEMP_SENSOR_PIN);
DallasTemperature tempSensor(&oneWire);
Servo grinderServo;
Servo juicerServo;

// Variables
float temperature = 0.0;
int waterLevel = 0;
int grinderSpeed = 0;  // 0 to 5 levels
bool juicerStatus = false;
bool valveStatus = false;

void setup() {
  Serial.begin(115200);
  Serial.println("\nStarting ESP32...");
  
  // Initialize pins
  pinMode(WATER_LEVEL_PIN, INPUT);
  analogReadResolution(12);  // Set ADC resolution to 12 bits (0-4095)
  analogSetAttenuation(ADC_11db);  // Set ADC attenuation for 3.3V range
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);  // Start with pump off
  
  // Initialize temperature sensor
  tempSensor.begin();
  
  // Initialize servos
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  grinderServo.setPeriodHertz(50);
  juicerServo.setPeriodHertz(50);
  grinderServo.attach(GRINDER_SERVO_PIN);
  juicerServo.attach(JUICER_SERVO_PIN);
  
  // Set initial positions
  grinderServo.write(0);  // Start at 0 degrees (OFF)
  juicerServo.write(0);   // Start at 0 degrees (OFF)
  
  // Connect to WiFi with more detailed debugging
  Serial.print("Connecting to WiFi network: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected successfully!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\nFailed to connect to WiFi!");
    Serial.println("Restarting ESP32...");
    ESP.restart();
  }
  
  // Setup server endpoints
  setupEndpoints();
  server.enableCORS();
  server.begin();
  
  Serial.println("HTTP server started");
  Serial.println("Ready to receive requests!");
}

void loop() {
  server.handleClient();
  updateSensors();
  delay(100);
}

void updateSensors() {
  // Update temperature
  tempSensor.requestTemperatures();
  temperature = tempSensor.getTempCByIndex(0);
  
  // Update water level with detailed debugging
  int rawWaterLevel = analogRead(WATER_LEVEL_PIN);
  
  // Debug raw reading
  Serial.println("\n----- Water Level Sensor Debug -----");
  Serial.print("Raw ADC Reading (0-4095): ");
  Serial.println(rawWaterLevel);
  
  // Map water level with improved logic and debug info
  Serial.print("Threshold Value: ");
  Serial.println(WATER_LEVEL_THRESHOLD);
  
  if (rawWaterLevel < WATER_LEVEL_THRESHOLD) {
    waterLevel = 50;
    Serial.println("Below threshold - Setting to minimum (50%)");
  } else {
    // Map from threshold to max (700-4095) to percentage (50-100)
    waterLevel = map(rawWaterLevel, WATER_LEVEL_THRESHOLD, WATER_LEVEL_MAX, 50, 100);
    waterLevel = constrain(waterLevel, 50, 100);
    Serial.print("Mapped and constrained value: ");
    Serial.print(waterLevel);
    Serial.println("%");
  }
  
  // Final readings
  Serial.println("\nFinal Sensor Readings:");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print("°C, Water Level: ");
  Serial.print(waterLevel);
  Serial.println("%");
  Serial.println("--------------------------------\n");
  
  delay(1000); // Add a small delay between readings
}

void setupEndpoints() {
  // Get sensor data endpoint
  server.on("/sensors", HTTP_GET, []() {
    Serial.println("Received sensor data request");
    
    DynamicJsonDocument doc(200);
    doc["temperature"] = temperature;
    doc["waterLevel"] = waterLevel;
    
    String response;
    serializeJson(doc, response);
    
    // Add CORS headers
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    
    Serial.print("Sending response: ");
    Serial.println(response);
    
    server.send(200, "application/json", response);
  });

  // Control grinder speed
  server.on("/control/grinder", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      DynamicJsonDocument doc(200);
      deserializeJson(doc, server.arg("plain"));
      grinderSpeed = doc["speed"].as<int>();
      
      // Convert speed (0-5) to angle (0-25 degrees, 5-degree intervals)
      int angle = grinderSpeed * 5;
      grinderServo.write(angle);
      
      Serial.print("Grinder speed set to: ");
      Serial.print(grinderSpeed);
      Serial.print(" (angle: ");
      Serial.print(angle);
      Serial.println("°)");
      
      server.send(200, "application/json", "{\"success\":true}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
    }
  });

  // Control juicer
  server.on("/control/juicer", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      DynamicJsonDocument doc(200);
      deserializeJson(doc, server.arg("plain"));
      juicerStatus = doc["status"].as<bool>();
      
      // Set servo angle (0° for off, 30° for on)
      juicerServo.write(juicerStatus ? 30 : 0);
      
      Serial.print("Juicer status changed to: ");
      Serial.println(juicerStatus ? "ON" : "OFF");
      
      server.send(200, "application/json", "{\"success\":true}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
    }
  });

  // Control valve (pump)
  server.on("/control/valve", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      DynamicJsonDocument doc(200);
      deserializeJson(doc, server.arg("plain"));
      valveStatus = doc["status"].as<bool>();
      
      // Control pump
      digitalWrite(PUMP_PIN, valveStatus ? HIGH : LOW);
      
      Serial.print("Valve/Pump status changed to: ");
      Serial.println(valveStatus ? "ON" : "OFF");
      
      server.send(200, "application/json", "{\"success\":true}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
    }
  });

  // Handle OPTIONS requests for CORS
  server.on("/sensors", HTTP_OPTIONS, []() {
    Serial.println("Received OPTIONS request");
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    
    server.send(200);
  });
  
  server.on("/control/grinder", HTTP_OPTIONS, []() {
    server.send(200);
  });
  
  server.on("/control/juicer", HTTP_OPTIONS, []() {
    server.send(200);
  });
  
  server.on("/control/valve", HTTP_OPTIONS, []() {
    server.send(200);
  });
}