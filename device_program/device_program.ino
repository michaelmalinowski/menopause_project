#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "SingleLinkedList.h"
#include "wifiSecrets.h"
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

//D4 on D1 Mini
#define TEMP_PIN 2 

//Class initializations start
ESP8266WiFiMulti WiFiMulti;

OneWire oneWire(TEMP_PIN);
DallasTemperature temperatureSensor(&oneWire);

//heartBeatList saves the last 15 recorded heart beats
SingleLinkedList* heartBeatList = new SingleLinkedList(15);
//temperatureList saves the last 15 recorded temperatures
SingleLinkedList* temperatureList = new SingleLinkedList(15);
MAX30105 heartRateSensor;
//Class initialization ends

//checkRate determines the averaging count
String key = String(API_KEY);
int checkRate = 1;
float temperature;
unsigned long timeElapsed;
unsigned long tempTimer;
long beatAverage = 0;
int beatCounter = 0;
int currentBPM;
int temperatureAlert = 0;



void WifiConnect(){
  Serial.println("Connecting");
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(WIFI_NAME, WIFI_PASS);
  Serial.println("Connected");
}


bool sendPing(String mode) {
  if((WiFiMulti.run() == WL_CONNECTED)) {
    Serial.println("PING");
    HTTPClient http;

    http.begin("http://34.66.131.1/updateCharacteristic?key="+ key +"&deviceName=Fan&characteristic=Status&value=" + mode); 

    int statusCode = http.POST(0,0);
    if(statusCode > 0) {
        if(statusCode == HTTP_CODE_OK) {
            String payload = http.getString();
            http.end();
            if (mode == "on") {
              return monitorTemperature();
            }
            return true;
        }
    } 
    http.end();
  }
  Serial.println("Fail");
  return false;
}



void readTemperature() {
  //Reads temperature twice due to previous temperature value being stored 
  temperatureSensor.getTempCByIndex(0);
  temperatureSensor.requestTemperatures();
  temperature = temperatureSensor.getTempCByIndex(0);

  timeElapsed = millis();
  tempTimer = millis();
  if (temperature - temperatureList->average() > 2) {
    temperatureAlert += 1;
  } else {
    temperatureList->add(temperature);
    temperatureAlert = 0;
  }
  Serial.print("Temperature: ");
  Serial.println(temperature);
}


//reads the ir sensor on the MAX30105 sensor and returns a boolean if a valid BPM was calculated
bool readHeartRate() {
  long irValue = heartRateSensor.getIR();
  if(irValue > 7000){                   
    if (checkForBeat(irValue) == true) {
    long beatDuration = millis() - timeElapsed;
      if (500 < beatDuration && 2000 > beatDuration && beatCounter < checkRate) {
        beatAverage += beatDuration;
        beatCounter++;
      } else if (beatCounter == checkRate) {
        if (currentBPM > 0) {
          currentBPM += beatAverage / (checkRate * 10);
          currentBPM = currentBPM / 2;
          Serial.print("currentBPM: ");
          Serial.println(currentBPM);
        } else {
          currentBPM += beatAverage / 100;
        }
        beatAverage = 0;
        beatCounter = 0;
        return true;
      } else {
        beatAverage = 0;
        beatCounter = 0;
      }
      timeElapsed = millis();
    }
  }
  return false;
}


bool monitorTemperature(){
  while(temperature - temperatureList->average() > 1) {
    Serial.println("Checking temperature");
    delay(20000);
    readTemperature();
  }
  delay(1000);
  return sendPing("off");
}


void setup() {
  //Start Sensors
  temperatureSensor.setResolution(12);
  temperatureSensor.begin();

  heartRateSensor.begin(Wire, I2C_SPEED_FAST);
  heartRateSensor.setup();
  heartRateSensor.setPulseAmplitudeRed(0x0A);

  Serial.begin(115200);
  tempTimer = millis();
  timeElapsed = millis();
}


void loop(){
  
  if (readHeartRate()) {
    heartBeatList->add(currentBPM);
    if (heartBeatList->full() && currentBPM - heartBeatList->average() > 15) {
      readTemperature();
    }
  }

  if (millis() - tempTimer > 60000) {
    readTemperature();
  }

  switch(temperatureAlert){
    case 1:
      delay(20000);
      readTemperature();
    case 2:
      WifiConnect();
      readTemperature();
    case 3:
      if(sendPing("on")) {
        Serial.println("Hot flash dealt with");
      } else {
        Serial.println("FAILED TO PING!");
      }
  }
}
