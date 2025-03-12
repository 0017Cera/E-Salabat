#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// WiFi Credentials
const char* ssid = "Paload_ka_sakin";
const char* password = "payetang";

// Static IP Configuration
IPAddress local_IP(192, 168, 47, 161);
IPAddress gateway(192, 168, 47, 191);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

// Pin Definitions
#define TEMP_SENSOR_PIN 4      // DS18B20 temperature sensor
#define JUICER_RELAY_PIN 18    // Juicer relay pin
#define MIXER_RELAY_PIN 19     // Mixer relay pin

// Motor control pins (BTS7960)
#define RPWM 16   // Forward PWM
#define LPWM 17   // Reverse PWM
#define R_EN 4    // Right Enable
#define L_EN 5    // Left Enable

// PWM properties
#define PWM_FREQ 5000    // 5 KHz
#define PWM_RESOLUTION 8 // 8-bit resolution (0-255)
#define PWM_CHANNEL_R 0  // PWM channel for RPWM
#define PWM_CHANNEL_L 1  // PWM channel for LPWM

// Objects
WebServer server(80);
OneWire oneWire(TEMP_SENSOR_PIN);
DallasTemperature tempSensor(&oneWire);

// Variables
float temperature = 0.0;
bool juicerStatus = false;
bool mixerStatus = false;
bool grinderStatus = false;
bool valveStatus = false;
bool heaterStatus = false;

void setup() {
    Serial.begin(115200);
    Serial.println("\nStarting ESP32 Control Unit...");

    // Initialize temperature sensor
    tempSensor.begin();

    // Initialize Relay Pins
    pinMode(JUICER_RELAY_PIN, OUTPUT);
    pinMode(MIXER_RELAY_PIN, OUTPUT);
    digitalWrite(JUICER_RELAY_PIN, HIGH);
    digitalWrite(MIXER_RELAY_PIN, HIGH);

    // Initialize motor control pins
    pinMode(RPWM, OUTPUT);
    pinMode(LPWM, OUTPUT);
    pinMode(R_EN, OUTPUT);
    pinMode(L_EN, OUTPUT);

    // Configure PWM for motor control
    ledcSetup(PWM_CHANNEL_R, PWM_FREQ, PWM_RESOLUTION);
    ledcSetup(PWM_CHANNEL_L, PWM_FREQ, PWM_RESOLUTION);
    ledcAttachPin(RPWM, PWM_CHANNEL_R);
    ledcAttachPin(LPWM, PWM_CHANNEL_L);

    // Enable motor driver
    digitalWrite(R_EN, HIGH);
    digitalWrite(L_EN, HIGH);

    // Initialize motor to stopped state
    ledcWrite(PWM_CHANNEL_R, 0);
    ledcWrite(PWM_CHANNEL_L, 0);

    // Connect to WiFi with static IP
    if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
        Serial.println("⚠️ Failed to configure static IP!");
    }

    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\n✅ Connected to WiFi");
    Serial.print("📌 Static IP Address: ");
    Serial.println(WiFi.localIP());

    // Setup server endpoints
    setupEndpoints();
    server.enableCORS();
    server.begin();
    Serial.println("🌐 HTTP server started");
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
    
    // Print status every 2 seconds
    static unsigned long lastPrint = 0;
    if (millis() - lastPrint >= 2000) {
        Serial.printf("\n--- Status Update ---\n");
        Serial.printf("Temperature: %.2f°C\n", temperature);
        Serial.printf("Juicer: %s\n", juicerStatus ? "ON" : "OFF");
        Serial.printf("Mixer: %s\n", mixerStatus ? "ON" : "OFF");
        Serial.printf("------------------\n");
        lastPrint = millis();
    }
}

void setupEndpoints() {
    // Get Sensor Data
    server.on("/sensors", HTTP_GET, []() {
        // Add CORS headers
        server.sendHeader("Access-Control-Allow-Origin", "*");
        server.sendHeader("Access-Control-Allow-Methods", "GET");
        server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

        DynamicJsonDocument doc(200);
        
        // Get fresh temperature reading
        tempSensor.requestTemperatures();
        temperature = tempSensor.getTempCByIndex(0);
        
        doc["temperature"] = temperature;
        doc["grinderStatus"] = grinderStatus;
        doc["valveStatus"] = valveStatus;
        doc["heaterStatus"] = heaterStatus;

        String response;
        serializeJson(doc, response);
        Serial.print("📡 Sending sensor data: ");
        Serial.println(response);
        server.send(200, "application/json", response);
    });

    // Get Machine State
    server.on("/state", HTTP_GET, []() {
        // Add CORS headers
        server.sendHeader("Access-Control-Allow-Origin", "*");
        server.sendHeader("Access-Control-Allow-Methods", "GET");
        server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

        DynamicJsonDocument doc(200);
        doc["grinderStatus"] = grinderStatus;
        doc["valveStatus"] = valveStatus;
        doc["heaterStatus"] = heaterStatus;
        doc["temperature"] = temperature;

        String response;
        serializeJson(doc, response);
        Serial.print("📡 Sending state data: ");
        Serial.println(response);
        server.send(200, "application/json", response);
    });

    // Control Juicer (ON/OFF)
    server.on("/control/juicer", HTTP_POST, []() {
        if (server.hasArg("plain")) {
            DynamicJsonDocument doc(200);
            deserializeJson(doc, server.arg("plain"));
            juicerStatus = doc["status"].as<bool>();

            digitalWrite(JUICER_RELAY_PIN, !juicerStatus);  // Invert for active LOW
            Serial.println(juicerStatus ? "🌀 Juicer turned ON" : "❌ Juicer turned OFF");

            DynamicJsonDocument response(200);
            response["juicerStatus"] = juicerStatus;

            String jsonResponse;
            serializeJson(response, jsonResponse);
            server.send(200, "application/json", jsonResponse);
        } else {
            server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
        }
    });

    // Control Mixer (ON/OFF)
    server.on("/control/mixer", HTTP_POST, []() {
        if (server.hasArg("plain")) {
            DynamicJsonDocument doc(200);
            deserializeJson(doc, server.arg("plain"));
            mixerStatus = doc["status"].as<bool>();

            digitalWrite(MIXER_RELAY_PIN, !mixerStatus);  // Invert for active LOW
            Serial.println(mixerStatus ? "🔄 Mixer turned ON" : "❌ Mixer turned OFF");

            DynamicJsonDocument response(200);
            response["mixerStatus"] = mixerStatus;

            String jsonResponse;
            serializeJson(response, jsonResponse);
            server.send(200, "application/json", jsonResponse);
        } else {
            server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
        }
    });

    // Update CORS handlers
    server.on("/sensors", HTTP_OPTIONS, []() {
        server.sendHeader("Access-Control-Allow-Origin", "*");
        server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
        server.send(200);
    });

    server.on("/state", HTTP_OPTIONS, []() {
        server.sendHeader("Access-Control-Allow-Origin", "*");
        server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
        server.send(200);
    });
}

// Function to control Mixer
void controlMixer(bool status) {
    mixerStatus = status;
    if (status) {
        ledcWrite(RPWM, 200);  // Fixed speed when ON (adjust value as needed)
    } else {
        ledcWrite(RPWM, 0);    // OFF
    }
    Serial.printf("Mixer: %s\n", status ? "ON" : "OFF");
} 