/*jshint esversion: 6 */
// @ts-check

import { setSaveIndicator, usbDevice, WebUSBCmdMap } from "./cntlr.js";

export async function updateNotchPoint(elemName) {
    let id_split = elemName.id.split("-");
    const ind = Number(id_split[1]);
    const x_or_y = id_split[2];
    let yvalue;
    let xvalue;
    if (x_or_y === "x") {
        // @ts-ignore
        yvalue = Number(document.getElementById(`notch-${ind}-y`).value);
        xvalue = Number(elemName.value);        
    } else if (x_or_y === "y") {
        yvalue = Number(elemName.value);
        // @ts-ignore
        xvalue = Number(document.getElementById(`notch-${ind}-x`).value);
    } else {
        console.log("Unexpected element calling updateNotchPoint().");
        return;
    }
    console.log(`id: ${ind}, x: ${xvalue}, y: ${yvalue}`);
    await usbDevice.transferOut(2, new Uint8Array([WebUSBCmdMap.NOTCH_SET, ind, xvalue, yvalue]));
    setSaveIndicator();
}

export function placeNotches(data) {
    for (let i = 0; i < 8; i++) {
        let notchpoint_input_x = /** @type {HTMLInputElement} */ (document.getElementById(`notch-${i}-x`));
        let notchpoint_input_y = /** @type {HTMLInputElement} */ (document.getElementById(`notch-${i}-y`)); 
        notchpoint_input_x.value = data.getInt8(1 + 2*i);
        notchpoint_input_y.value = data.getInt8(2 + 2*i);
        console.log(`Setting ${i} to ${notchpoint_input_x.value}, ${notchpoint_input_y.value}`); 
    }
}