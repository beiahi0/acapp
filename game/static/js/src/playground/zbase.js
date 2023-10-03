class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
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