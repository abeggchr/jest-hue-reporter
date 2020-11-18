const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

class JestCustomReporter {
  USERNAME = ""; // Credentials to access the Hue bridge
  IP = ""; // IP of the Hue bridge
  LAMP_IDS = [1, 2, 3]; // IDs of the lamps where the color changes

  BRIGHTNESS_DELTA = 80;
  GREEN = 23855;
  BLUE = 46986;
  RED = 65526;

  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this._color = undefined;
  }

  async getHue() {
    if (!this._hue) {
      const api = await v3.api.createLocal(this.IP).connect(this.USERNAME);
      const lights = await api.lights.getAll();
      const ids = Array.from(lights)
        .map((l) => l.id)
        .filter((i) => this.LAMP_IDS.includes(i));
      // console.log(`Connected to ${ids.length} lights`);
      this._hue = { api: api, ids: ids };

      /*
            this._hue.ids.forEach(async id => {
                const hue = await this.getHue();
                const result = await hue.api.lights.getLight(id)
                .then(light => {
                  // Display the details of the light
                  console.log(light.toStringDetailed());
                });
            });
            */
    }
    return this._hue;
  }

  async onRunStart(test) {
    await this.changeBrightness(-1 * this.BRIGHTNESS_DELTA);
  }

  async onTestResult(test, testResult, results) {
    // console.log(`onTestResult ${results.numFailedTests}`);
    if (results.numFailedTests) {
      await this.setColor(this.RED);
    } else {
      await this.setColor(this.GREEN);
    }
  }

  async onRunComplete(contexts, results) {
    this.changeBrightness(this.BRIGHTNESS_DELTA);
    // console.log(`onTestResult ${results.numFailedTests} ${results.numTotalTestSuites}`);
    if (results.numFailedTests) {
      await this.setColor(this.RED);
    } else if (results.numTotalTestSuites === 0) {
      await this.setColor(this.BLUE);
    } else {
      await this.setColor(this.GREEN);
    }
  }

  async setColor(hueColor) {
    if (this._color !== hueColor) {
      const hue = await this.getHue();
      hue.ids.forEach(async (id) => {
        const state = new LightState()
          .on()
          .hue(hueColor)
          .sat(254)
          .transitionInMillis(500);
        await hue.api.lights.setLightState(id, state);
        // console.log(`Light state change to ${red} ${green} ${blue} for ${id} was successful? ${result}`);
        this._color = hue;
      });
    }
  }

  async changeBrightness(delta) {
    const hue = await this.getHue();
    hue.ids.forEach(async (id) => {
      const decrease = new LightState().bri_inc(delta);
      const result = await hue.api.lights.setLightState(id, decrease);
    });
  }
}

module.exports = JestCustomReporter;
