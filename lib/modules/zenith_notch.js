/*jshint esversion: 6 */
// @ts-check

import { setSaveIndicator, usbDevice, WebUSBCmdMap } from "./cntlr.js";
import { IntToFloat32, swap32 } from "./utils.js";

function toDeadzoneAng(num) {
    return Math.abs(num/180.) * (1<<(16-1));
}

function fromDeadzoneAng(num) {
    return num/ (1<<(16-1)) * 180.;
}

export async function updateNotchPoint(elemName) {
    let id_split = elemName.id.split("-");
    const ind = Number(id_split[1]);
    const type = id_split[2];
    let deadzonevalue;
    let yvalue;
    let xvalue;
    if (type === "x") {
        // @ts-ignore
        deadzonevalue = toDeadzoneAng(Number(document.getElementById(`notch-${ind}-deadzonevalue`).value));
        // @ts-ignore
        yvalue = Number(document.getElementById(`notch-${ind}-y`).value);
        xvalue = Number(elemName.value);        
    } else if (type === "y") {
        // @ts-ignore
        deadzonevalue = toDeadzoneAng(Number(document.getElementById(`notch-${ind}-deadzonevalue`).value));
        yvalue = Number(elemName.value);
        // @ts-ignore
        xvalue = Number(document.getElementById(`notch-${ind}-x`).value);
    } else if (type === "deadzone") {
        deadzonevalue = toDeadzoneAng(Number(elemName.value));
        // @ts-ignore
        yvalue = Number(document.getElementById(`notch-${ind}-y`).value);
        // @ts-ignore
        xvalue = Number(document.getElementById(`notch-${ind}-x`).value);
    } else {
        console.error("Unexpected element calling updateNotchPoint().");
        return;
    }
    console.log(`id: ${ind}, x: ${xvalue}, y: ${yvalue}, ang: ${deadzonevalue}`);
    await usbDevice.transferOut(2, new Uint8Array([WebUSBCmdMap.NOTCH_SET, ind, xvalue, yvalue, deadzonevalue >> 8, deadzonevalue & 0xFF]));
    setSaveIndicator();
}

export function placeNotches(data) {
    for (let i = 0; i < 8; i++) {
        let notchpoint_input_x = /** @type {HTMLInputElement} */ (document.getElementById(`notch-${i}-x`));
        let notchpoint_input_y = /** @type {HTMLInputElement} */ (document.getElementById(`notch-${i}-y`)); 
        let notchpoint_input_deadzone = /** @type {HTMLInputElement} */ (document.getElementById(`notch-${i}-deadzone`)); 
        notchpoint_input_x.value = data.getInt8(1 + 4*i);
        notchpoint_input_y.value = data.getInt8(2 + 4*i);
        notchpoint_input_deadzone.value = fromDeadzoneAng(data.getUint16(3 + 4*i)).toFixed(3);
        console.log(`Setting ${i} to ${notchpoint_input_x.value}, ${notchpoint_input_y.value}, ${notchpoint_input_deadzone.value}`); 
    }
}