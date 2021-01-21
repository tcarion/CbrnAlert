export default function websocket_utils() {
    $(".topbar-elem").on('click', function () {
        let id = $(this).data("user-feedback")
        $(id).toggle(500)
    });
}