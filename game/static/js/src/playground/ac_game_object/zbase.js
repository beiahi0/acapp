let Ac_Game_Objects = [];

class AcGameObject {
    constructor() {
        Ac_Game_Objects.push(this);
    }

    // 指挥在第一帧执行
    start() {

    }

    update() { // 每一帧均会执行

    }
    un_destroy() { // 在销毁前执行一次

    }
    destroy() { // 删掉该物体
        this.un
        for (let i = 0; i < Ac_Game_Objects.length; i++) {
            if (Ac_Game_Objects[i] === this) {
                Ac_Game_Objects.splice(i, 1);
                break;
            }
        }
    }

}