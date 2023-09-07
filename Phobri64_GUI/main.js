import { connect, saveSettings, resetSettings } from "../lib/modules/cntlr.js";
import { prevStep, nextStep, startCalib } from "../lib/modules/zenith_calib.js";
import { setCommsMode } from "../lib/modules/zenith_remap.js";

// functions exported to the HTML world
window._fns = {
    connect,
    prevStep,
    nextStep,
    startCalib,
    saveSettings,
    resetSettings,
    setCommsMode
};

///////////
// INIT //
/////////

document.getElementById("app-title").textContent = `${productName} Config Tool`