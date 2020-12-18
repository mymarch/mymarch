$(document).ready(function () {
    sessionStorage.removeItem("selectArray");
    sessionStorage.removeItem("resArray");
});

$(document).on("click", ".c_before", function () {
    const id = $(this).attr("id");
    handlerClickCircleAdd(id);
    $(this).parents(".circle_box").hide();

    //$(window).scrollTop(9999);
});

$(document).on("click", ".c_after", function () {
    const id = $(this).attr("id");
    handlerClickCircleRemove(id);
});

$(document).on("click", "#result_btn", function () {
    if (confirm("결과를 확인하시겠습니까?")) handlerClickResultBtn();
});

$(document).on("click", "#restart_btn", function () {
    if (confirm("테스트를 처음부터 진행 하시겠습니까?"))
        handlerClickRestartBtn();
});

$(document).on("click", "#send_email_btn", function () {
    const name = $("#name").val();
    const email = $("#email").val();
    const res = sessionStorage.getItem("resArray");

    if (name.replace(/ /gi, "") === "") {
        alert("성함을 입력해주세요!");
        $("#name").focus();
        return;
    }

    if (email.replace(/ /gi, "") === "") {
        alert("이메일을 입력해주세요!");
        $("#email").focus();
        return;
    }

    if (confirm("결과를 전송하시겠습니까?")) {
        handlerClickSendEmailBtn(name, email, res);
    }
});

const handlerClickCircleAdd = (id) => {
    //playSound("click_sound");
    let color = sessionStorage.getItem("selectArray");
    let colorArray = new Array();

    if (color != null && color != "") {
        colorArray = color.split(",");
    }

    if (!isDuplicate(colorArray, id)) {
        alert("이미 선택된 컬러입니다.");
        return;
    }

    colorArray.push(id);

    sessionStorage.setItem("selectArray", colorArray);

    const $c_after =
        '<div class="circle_box"><div class="circle c_after" id="' +
        id +
        '"></div><p class="circle_t">' +
        id +
        "</p></div>";

    $("#circle_after_con").append($c_after);

    if (colorArray.length == 12) {
        $(".result_btn_con").show();
    } else {
        $(".result_btn_con").hide();
    }
};

const handlerClickCircleRemove = (id) => {
    let color = sessionStorage.getItem("selectArray");
    let colorArray = new Array();

    if (color != null && color != "") {
        colorArray = color.split(",");
    }

    const idx = colorArray.indexOf(id);
    if (idx > -1) colorArray.splice(idx, 1);
    sessionStorage.setItem("selectArray", colorArray);

    $("#circle_after_con #" + id)
        .parents(".circle_box")
        .remove();

    $("#circle_before_con #" + id)
        .parents(".circle_box")
        .show();

    $("#result_btn").hide();
};

const isDuplicate = (array, str) => {
    if (array.length === 0) return true;

    for (var i = 0; i < array.length; i++) {
        if (array.indexOf(str) !== -1) return false;
        else return true;
    }
};

const handlerClickResultBtn = () => {
    playSound("result_sound");

    const resultNum = [1, 2, 3, 4, 11, 12];
    let rn;
    let colorArray = sessionStorage.getItem("selectArray").split(",");
    let resultArray = new Array();
    for (var i = 0; i < resultNum.length; i++) {
        rn = resultNum[i] - 1;
        resultArray.push(colorArray[rn]);
    }

    sessionStorage.setItem("resArray", resultArray);

    let $c_after;

    for (var i = 0; i < resultArray.length; i++) {
        $c_after =
            '<div class="circle_box"><div class="circle c_after" id="' +
            resultArray[i] +
            '"></div><p class="circle_t">' +
            resultArray[i] +
            "</p></div>";

        $("#circle_result_con").append($c_after);
    }

    $(".c_after").removeClass("c_after");

    $("#send_email_con").show();
    $("#result_con").show();

    $(".restart_btn_con").show();

    $(window).scrollTop(9999);
};

const playSound = (fileName) => {
    const audio = document.getElementById(fileName);

    if (audio.paused) {
        audio.volume = 0.5;
        audio.play();
    } else {
        audio.pause();
        audio.currentTime = 0;
    }
};

const handlerClickRestartBtn = () => {
    $(window).scrollTop(0);
    history.go(0);
};

const handlerClickSendEmailBtn = (name, email, res) => {
    $.ajax({
        type: "GET",
        url:
            "https://script.google.com/macros/s/AKfycby4P5y4xRROK1x9NL3qrGFyV7kXeyhMFvZAzY8sL_mKKWMf57I/exec",
        data: {
            name: name,
            email: email,
            res: res,
        },
        beforeSend: function () {
            $("#loading_con").show();
        },
        success: function (data) {
            alert(
                "결과가 전송되었습니다.\n작성해 주신 메일로 결과지를 보내드리겠습니다."
            );
            window.close();
        },
        error: function (data) {
            alert("전송 에러입니다.\n잠시후 다시 시도해주세요.");
        },
        complete: function () {
            $("#loading_con").hide();
        },
    });
};

const handlerClickCloseBtn = () => {
    window.close();
}
