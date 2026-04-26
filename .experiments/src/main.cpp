#include <Arduino.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <Adafruit_ZeroDMA.h>
#include <Adafruit_ADT7410.h>
#include <Adafruit_LIS3DH.h>
#include <Adafruit_NeoPixel.h>
#include <Wire.h>

// --- Hardware Pins ---
#define TFT_D0        34
#define TFT_WR        26
#define TFT_DC        10
#define TFT_CS        11
#define TFT_RST       24
#define TFT_RD         9
#define TFT_BACKLIGHT 25
#define LIGHT_SENSOR  A2
#define NEOPIXEL_PIN  2

// --- UI Colors (Pro / Dark Mode) ---
#define APEX_ACCENT  0xF81F  // Sharp Magenta
#define APEX_SUBTLE  0x4208  // Deep Charcoal
#define APEX_TEXT    0xFFFF  // Pure White
#define APEX_WARN    0xFFE0  // Amber
#define APEX_OK      0x07E0  // Emerald Green
#define APEX_CYAN    0x07FF
#define APEX_BLACK   0x0000

// --- Layout Constants ---
#define SIDEBAR_WIDTH 120
#define HEADER_HEIGHT 30
#define FOOTER_HEIGHT 20
#define LOG_X         (SIDEBAR_WIDTH + 10)
#define LOG_Y         (HEADER_HEIGHT + 10)
#define LOG_WIDTH     (320 - SIDEBAR_WIDTH - 20)
#define LOG_HEIGHT    (240 - HEADER_HEIGHT - FOOTER_HEIGHT - 20)
#define LINE_HEIGHT   14
#define MAX_LINES     (LOG_HEIGHT / LINE_HEIGHT)

// --- Global Objects ---
Adafruit_ILI9341 tft = Adafruit_ILI9341(tft8bitbus, TFT_D0, TFT_WR, TFT_DC, TFT_CS, TFT_RST, TFT_RD);
Adafruit_ADT7410 tempsensor = Adafruit_ADT7410();
Adafruit_LIS3DH lis = Adafruit_LIS3DH();
Adafruit_NeoPixel pixel = Adafruit_NeoPixel(1, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

// --- State Variables ---
int log_line_idx = 0;
char cmd_buffer[64];
int cmd_ptr = 0;
bool has_lis = false;
bool has_temp = false;

void draw_frame() {
  tft.fillScreen(APEX_BLACK);
  
  // Header - Minimalist Style
  tft.setTextSize(2);
  tft.setCursor(10, 7);
  tft.setTextColor(APEX_TEXT);
  tft.print("APEX");
  tft.setTextColor(APEX_ACCENT);
  tft.print("::");
  tft.setTextColor(APEX_TEXT);
  tft.print("ADVANCED_OS");
  
  // Header accent line
  tft.drawFastHLine(0, HEADER_HEIGHT - 1, 320, APEX_ACCENT);
  
  // Sidebar Border
  tft.drawFastVLine(SIDEBAR_WIDTH, HEADER_HEIGHT, 240 - HEADER_HEIGHT, APEX_SUBTLE);
  
  // Footer
  tft.drawFastHLine(0, 240 - FOOTER_HEIGHT, 320, APEX_SUBTLE);
  tft.setTextColor(APEX_WARN);
  tft.setTextSize(1);
  tft.setCursor(5, 240 - 15);
  tft.print("STATUS: RUNNING | MODE: MULTI_TOOL");
}

void apex_log(const char* msg, uint16_t color = APEX_TEXT) {
  if (log_line_idx >= MAX_LINES) {
    tft.fillRect(LOG_X, LOG_Y, LOG_WIDTH, LOG_HEIGHT, APEX_BLACK);
    log_line_idx = 0;
  }
  
  tft.setCursor(LOG_X, LOG_Y + (log_line_idx * LINE_HEIGHT));
  tft.setTextColor(color);
  tft.setTextSize(1);
  tft.print("~ ");
  tft.print(msg);
  
  log_line_idx++;
  Serial.print("LOG: ");
  Serial.println(msg);
}

void update_telemetry() {
  tft.fillRect(5, HEADER_HEIGHT + 5, SIDEBAR_WIDTH - 10, 180, APEX_BLACK);
  
  tft.setTextSize(1);
  int y = HEADER_HEIGHT + 10;
  
  // Temperature
  tft.setTextColor(APEX_ACCENT);
  tft.setCursor(5, y); tft.print("CORE_TEMP");
  y += 10;
  tft.setTextColor(APEX_TEXT);
  tft.setCursor(5, y); 
  if (has_temp) {
    tft.print(tempsensor.readTempC()); tft.print(" C");
  } else {
    tft.print("ERR");
  }
  y += 15;
  
  // Light Sensor
  tft.setTextColor(APEX_ACCENT);
  tft.setCursor(5, y); tft.print("LUMENS");
  y += 10;
  tft.setTextColor(APEX_TEXT);
  tft.setCursor(5, y); tft.print(analogRead(LIGHT_SENSOR));
  y += 15;
  
  // Accelerometer
  tft.setTextColor(APEX_ACCENT);
  tft.setCursor(5, y); tft.print("MOTION (G)");
  y += 10;
  if (has_lis) {
    sensors_event_t event;
    lis.getEvent(&event);
    tft.setTextColor(APEX_TEXT);
    tft.setCursor(5, y); tft.print("X: "); tft.print(event.acceleration.x, 1);
    y += 10;
    tft.setCursor(5, y); tft.print("Y: "); tft.print(event.acceleration.y, 1);
    y += 10;
    tft.setCursor(5, y); tft.print("Z: "); tft.print(event.acceleration.z, 1);
  } else {
    tft.setTextColor(APEX_TEXT);
    tft.setCursor(5, y); tft.print("OFFLINE");
    y += 20;
  }
  y += 15;

  // Uptime
  tft.setTextColor(APEX_ACCENT);
  tft.setCursor(5, y); tft.print("UPTIME");
  y += 10;
  tft.setTextColor(APEX_TEXT);
  tft.setCursor(5, y); tft.print(millis()/1000); tft.print("s");
}

void process_command(char* cmd) {
  String command = String(cmd);
  command.trim();
  
  if (command == "ping") {
    apex_log("PONG!", APEX_OK);
  } 
  else if (command == "clear") {
    draw_frame();
    log_line_idx = 0;
    apex_log("Workspace reset.", APEX_OK);
  } 
  else if (command == "reboot") {
    apex_log("INITIALIZING RESTART...", APEX_WARN);
    delay(1000);
    NVIC_SystemReset();
  } 
  else if (command == "sysinfo") {
    apex_log("--- SYSTEM DIAGNOSTICS ---", APEX_CYAN);
    apex_log("CPU: SAMD51 120MHz");
    apex_log("RAM: 256KB");
    apex_log(has_temp ? "ADT7410: ONLINE" : "ADT7410: OFFLINE");
    apex_log(has_lis ? "LIS3DH: ONLINE" : "LIS3DH: OFFLINE");
    apex_log("--------------------------", APEX_CYAN);
  }
  else if (command.startsWith("echo ")) {
    apex_log(command.substring(5).c_str(), APEX_TEXT);
  }
  else if (command.startsWith("led ")) {
    String color = command.substring(4);
    if (color == "red") { pixel.setPixelColor(0, 255, 0, 0); apex_log("LED: RED", APEX_OK); }
    else if (color == "green") { pixel.setPixelColor(0, 0, 255, 0); apex_log("LED: GREEN", APEX_OK); }
    else if (color == "blue") { pixel.setPixelColor(0, 0, 0, 255); apex_log("LED: BLUE", APEX_OK); }
    else if (color == "white") { pixel.setPixelColor(0, 255, 255, 255); apex_log("LED: WHITE", APEX_OK); }
    else if (color == "off") { pixel.setPixelColor(0, 0, 0, 0); apex_log("LED: OFF", APEX_OK); }
    else { apex_log("LED: Unknown color", APEX_WARN); }
    pixel.show();
  }
  else {
    char err[80];
    sprintf(err, "INVALID_CMD: %s", cmd);
    apex_log(err, 0xF800); // Red
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(TFT_BACKLIGHT, OUTPUT);
  digitalWrite(TFT_BACKLIGHT, HIGH);
  
  tft.begin();
  tft.setRotation(1);
  
  pixel.begin();
  pixel.setBrightness(50);
  pixel.setPixelColor(0, 0, 0, 0); // Off by default
  pixel.show();
  
  if (tempsensor.begin()) {
    has_temp = true;
  }
  
  if (lis.begin(0x18) || lis.begin(0x19)) {
    has_lis = true;
    lis.setRange(LIS3DH_RANGE_4_G);
  }
  
  draw_frame();
  apex_log("APEX_OS_V2.0_MULTITOOL", APEX_ACCENT);
  apex_log("IO_LINK_ESTABLISHED");
  apex_log("AWAITING_INSTRUCTIONS...");
}

void loop() {
  static uint32_t last_telemetry = 0;
  if (millis() - last_telemetry > 500) {
    update_telemetry();
    last_telemetry = millis();
  }
  
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n' || c == '\r') {
      if (cmd_ptr > 0) {
        cmd_buffer[cmd_ptr] = '\0';
        process_command(cmd_buffer);
        cmd_ptr = 0;
      }
    } else if (cmd_ptr < 63) {
      // Only accept printable chars
      if (c >= 32 && c <= 126) {
        cmd_buffer[cmd_ptr++] = c;
      }
    }
  }
}
