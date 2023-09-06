import { connect } from "../lib/modules/cntlr.js";
import { prevStep, nextStep, startCalib } from "../lib/modules/zenith_calib.js";

// functions exported to the HTML world
window._fns = {
    connect,
    prevStep,
    nextStep,
    startCalib
};

document.getElementById("app-title").textContent = `${productName} Config Tool`