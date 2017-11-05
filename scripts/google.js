$("body").append(`<style>
    body.hidecruft #tvcap,
    body.hidecruft .cu-container,
    body.hidecruft #bottomads {
        display: none;
    }

    [toggleCruft] {
        text-decoration: underline !important;
        cursor: pointer;
    }
</style>`);

$("body").addClass('hidecruft');

$("#resultStats").append('| <a toggleCruft>Toggle cruft</a>');

$("#resultStats").on('click', '[toggleCruft]', () => {
    $("body").toggleClass('hidecruft');
});