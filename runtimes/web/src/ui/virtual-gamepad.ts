import { LitElement, html, css } from "lit";

import * as constants from "../constants";
import { Runtime } from "../runtime";

function setClass (element: Element | null, className: string, enabled: boolean | number) {
    if(!element) {
        return;
    }
    if (enabled) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

function requestFullscreen () {
    if (document.fullscreenElement == null) {
        document.body.requestFullscreen({navigationUI: "hide"});
    }
}

export class VirtualGamepad extends LitElement {
    static styles = css`
        @media (pointer: fine) {
            :host {
                display: none;
            }
        }
        :host {
          pointer-events: none;
        }

        :host-context(body.focus) {
          display: none;
        }

        .dpad {
            position: absolute;
            width: 39px;
            height: 120px;
            left: 69px;
            bottom: 30px;
            background: #444;
            border-radius: 9px;
        }
        .dpad:before {
            position: absolute;
            width: 120px;
            height: 39px;
            top: 39px;
            left: -39px;
            background: #444;
            border-radius: 9px;
            content: "";
        }
        .dpad:after {
            position: absolute;
            height: 39px;
            width: 39px;
            top: 39px;
            border-radius: 100%;
            background: #333;
            content: "";
        }
        .dpad.pressed-left:before {
            border-left: 4px solid #A93671;
            width: 116px;
        }
        .dpad.pressed-right:before {
            border-right: 4px solid #A93671;
            width: 116px;
        }
        .dpad.pressed-up {
            border-top: 4px solid #A93671;
        }
        .dpad.pressed-down {
            border-bottom: 4px solid #A93671;
            height: 116px;
        }

        .action1 {
            right: 80px;
            bottom: 30px;
        }
        .action2 {
            right: 30px;
            bottom: 90px;
        }
        .action1, .action2 {
            position: absolute;
            width: 60px;
            height: 60px;
            border: 4px solid #A93671;
            border-radius: 50px;
        }
        .action1.pressed, .action2.pressed {
            background: #A93671;
        }
    `;

    runtime: Runtime;

    // TODO(2022-02-21): Fix possible memory leak from re-rendering by adding window listeners only
    // once
    //
    // connectedCallback () {
    //     super.connectedCallback();
    // }

    // disconnectedCallback () {
    //     super.disconnectedCallback();
    // }

    render () {
        const dpad = document.createElement("div");
        dpad.className = "dpad";

        const action1 = document.createElement("div");
        action1.className = "action1";

        const action2 = document.createElement("div");
        action2.className = "action2";

        const touchEvents = new Map();
        const onPointerEvent = (event: PointerEvent) => {
            // Do certain things that require a user gesture
            if (event.type == "pointerup") {
                if (event.pointerType == "touch") {
                    requestFullscreen();
                }
                this.runtime.unlockAudio();
            }

            if (event.pointerType != "touch") {
                return;
            }
            event.preventDefault();

            switch (event.type) {
            case "pointerdown": case "pointermove":
                touchEvents.set(event.pointerId, event);
                break;
            default:
                touchEvents.delete(event.pointerId);
                break;
            }

            let buttons = 0;
            if (touchEvents.size) {
                const DPAD_MAX_DISTANCE = 100;
                const DPAD_DEAD_ZONE = 10;
                const BUTTON_MAX_DISTANCE = 50;
                const DPAD_ACTIVE_ZONE = 3 / 5; // cos of active angle, greater that cos 60 (1/2)

                const dpadBounds = dpad!.getBoundingClientRect();
                const dpadX = dpadBounds.x + dpadBounds.width/2;
                const dpadY = dpadBounds.y + dpadBounds.height/2;

                const action1Bounds = action1!.getBoundingClientRect();
                const action1X = action1Bounds.x + action1Bounds.width/2;
                const action1Y = action1Bounds.y + action1Bounds.height/2;

                const action2Bounds = action2!.getBoundingClientRect();
                const action2X = action2Bounds.x + action2Bounds.width/2;
                const action2Y = action2Bounds.y + action2Bounds.height/2;

                let x, y, dist, cosX, cosY;
                for (let touch of touchEvents.values()) {
                    x = touch.clientX - dpadX;
                    y = touch.clientY - dpadY;
                    dist = Math.sqrt( x*x + y * y );

                    if (dist < DPAD_MAX_DISTANCE && dist > DPAD_DEAD_ZONE) {
                        cosX = x / dist;
                        cosY = y / dist;

                        if (-cosX > DPAD_ACTIVE_ZONE) {
                            buttons |= constants.BUTTON_LEFT;
                        } else if (cosX > DPAD_ACTIVE_ZONE) {
                            buttons |= constants.BUTTON_RIGHT;
                        }
                        if (-cosY > DPAD_ACTIVE_ZONE) {
                            buttons |= constants.BUTTON_UP;
                        } else if (cosY > DPAD_ACTIVE_ZONE) {
                            buttons |= constants.BUTTON_DOWN;
                        }
                    }

                    x = touch.clientX - action1X;
                    y = touch.clientY - action1Y;
                    if (x*x + y*y < BUTTON_MAX_DISTANCE*BUTTON_MAX_DISTANCE) {
                        buttons |= constants.BUTTON_X;
                    }

                    x = touch.clientX - action2X;
                    y = touch.clientY - action2Y;
                    if (x*x + y*y < BUTTON_MAX_DISTANCE*BUTTON_MAX_DISTANCE) {
                        buttons |= constants.BUTTON_Z;
                    }
                }
            }

            const nowXZDown = buttons & (constants.BUTTON_X | constants.BUTTON_Z);
            const wasXZDown = this.runtime.getGamepad(0) & (constants.BUTTON_X | constants.BUTTON_Z);
            if (nowXZDown && !wasXZDown) {
                navigator.vibrate(1);
            }

            setClass(action1, "pressed", buttons & constants.BUTTON_X);
            setClass(action2, "pressed", buttons & constants.BUTTON_Z);
            setClass(dpad, "pressed-left", buttons & constants.BUTTON_LEFT);
            setClass(dpad, "pressed-right", buttons & constants.BUTTON_RIGHT);
            setClass(dpad, "pressed-up", buttons & constants.BUTTON_UP);
            setClass(dpad, "pressed-down", buttons & constants.BUTTON_DOWN);

            this.runtime.setGamepad(0, buttons);
        }
        window.addEventListener("pointercancel", onPointerEvent);
        window.addEventListener("pointerdown", onPointerEvent);
        window.addEventListener("pointermove", onPointerEvent);
        window.addEventListener("pointerup", onPointerEvent);

        return html`
            ${dpad} ${action1} ${action2}
        `;
    }
}

export const virtualGamepadTagName = "wasm4-virtual-gamepad";
declare global {
    interface HTMLElementTagNameMap {
        [virtualGamepadTagName]: VirtualGamepad;
    }
}
customElements.define(virtualGamepadTagName, VirtualGamepad);
