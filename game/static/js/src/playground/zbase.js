class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div>游戏界面!!!</div>`);
        this.root.$ac_game.append(this.$playground);
    }
    start() {

    }
    // open $playground 
    show() {
        console.log("playground show");
        this.$playground.show();
    }

    // close $playground
    hide() {
        this.$playground.hide();
    }
}