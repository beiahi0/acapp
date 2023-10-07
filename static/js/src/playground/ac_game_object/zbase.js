let Ac_Game_Objects = [];

class AcGameObject {
    constructor() {
        this.has_called_start = false; // 是否执行过 start 函数
        Ac_Game_Objects.push(this);
        this.timedelta = 0; //  当前帧距离上一帧的时间间隔
    }

    // 指挥在第一帧执行
    start() {
        console.log("Acgame start");
    }

    update() { // 每一帧均会执行
    }
    on_destroy() { // 在销毁前执行一次

    }
    destroy() { // 删掉该物体
        this.on_destroy();
        for (let i = 0; i < Ac_Game_Objects.length; i++) {
            if (Ac_Game_Objects[i] === this) {
                Ac_Game_Objects.splice(i, 1);
                break;
            }
        }
    }

}

let last_timestamp;

let AC_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < Ac_Game_Objects.length; i++) {
        let obj = Ac_Game_Objects[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
