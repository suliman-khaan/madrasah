$(function () {
  //NIC E.g. xxxxx-xxxxxxx-x
  $(".nic").formatter({
    pattern: "{{99999}}-{{9999999}}-{{9}}",
    //'persistent': true
  });
  //MOBILE E.g. xxxx-xxxxxxx
  $(".mobile").formatter({
    pattern: "{{9999}}-{{9999999}}",
    //'persistent': true
  });
});
