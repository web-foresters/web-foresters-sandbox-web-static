var $screen = $(document);
var $scene = 0;
var $totalNumScenes = 8;
const $appear_and_fade_time = 600; //in milliseconds
const speed = 9000;
const buffer = 20;
const $targets = $(".target");
console.info("Target count = " + $targets.length);
const $bullet = $("#Bullet");

//Story Place
const $Scene2_text = "One day, Peter, Benjamin,and Lily went to Mr.Greggor's Garden to pick vegetables.";
const $Scene3_text = "Suddenly, a devious fox called Mr.Tod has appeared  in front of them!";
const $Scene4_text = "'Run!',they squeaked, horrified.";
const $Scene5_text = "The devious fox is becoming nearer and nearer from the bunnies. At last, they are all captured in a tight, metal cage.";
const $Scene6_text = "'What should we do!',screamed Benjamin.";
const $Scene7_text = "'A good rabbit never gives up,' Peter said quietly and confidently. 'I have an excellent plan.'";
const $Scene8_text ="'Lily, find a long rope. Benjamin, once Lily finds a long rope, swing the rope hard at Mr.Tod and tie him until he cannot move.'";
const $Scene9_text = "So Lily searched again and again in her 'Just-In-Case' pocket, finally finding a hard and firm rope that could stretch all the way to the end of Mr.Tod's house.";
const $Scene10_text = "Benjamin, grabbing the rope, swinged it hard onto Mr.Tod. Mr.Tod, losing his ballance, fell hard to the ground with a loud bang.";
const $Scene11_text = "'Ouch!', Mr.Tod screamed, as Benjamin swiftly tied him in a thick, long rope.";
//Story Place


$targets.click(function (event) {
  shootMe(event);
});
$targets.animate(
  {
    top: $screen.height() - ($targets.height() + buffer),
    left: $screen.width() - ($targets.width() + buffer)
  },
  speed
);
var targetModified = false;
function shootMe(event) {
  var $target = $(event.target);
  $target.stop();
  $bullet.animate(
    {
      top: $target.offset().top + ($target.height() - $bullet.height()) / 2,
      left: $target.offset().left + ($target.width() - $bullet.width()) / 2
    },
    function () {
      if (targetModified) {
        $target.css({
          "background-color": "",
          border: "",
          "border-radius": ""
        });
        $target.animate(
          {
            top: 0,
            left: $screen.width() - ($target.width() + buffer)
          },
          speed
        );
      } else {
        $target.css({
          "background-color": "rgb(120, 200, 0)",
          border: "4px dashed gray",
          "border-radius": "44px"
        });
        $target.animate(
          {
            top: 0,
            left: 0
          },
          speed
        );
      }
      targetModified = !targetModified;
    }
  );
}

function showSceneOne() {
  $(".target").hide(0);
  $("#Bullet").hide(0);
  $("#back").fadeOut($appear_and_fade_time);
  $("#back").each(function () {
    this.style.pointerEvents = "none";
  });
  $("#home_button").each(function () {
    this.style.pointerEvents = "none";
  });
  $("#home_button").fadeOut($appear_and_fade_time);
  $("#next").each(function () {
    this.style.pointerEvents = "auto";
  });
  $("#next").fadeIn($appear_and_fade_time);
  $("#Image_not_available").hide(0);
  $("#a_good_rabbit_never_gives_up").hide(0);
}

function showSceneTwo() {
  $("#Scene2_text").text($Scene2_text);
  $("#back").each(function () {
    this.style.pointerEvents = "auto";
  });
  $("#back").fadeIn($appear_and_fade_time);
  $("#home_button").fadeIn($appear_and_fade_time);
  $("#home_button").each(function () {
    this.style.pointerEvents = "auto";
  });
}

function showSceneThree() {
  $("#Scene3_text").text($Scene3_text);
}

function showSceneFour() {
  $("#Scene4_text").text($Scene4_text);
  $("#Image_not_available").hide(0);
}

function showSceneFive() {
  $("#Scene5_text").text($Scene5_text);
  $("#Image_not_available").show($appear_and_fade_time);
}

function showSceneSix() {
  $("#Scene6_text").text($Scene6_text);
  $("#Image_not_available").show($appear_and_fade_time);
  $("#a_good_rabbit_never_gives_up").hide(0);
}

function showSceneSeven() {
  $("#Image_not_available").hide(0);
  $("#Scene7_text").text($Scene7_text);
  $("#a_good_rabbit_never_gives_up").show($appear_and_fade_time);
}

function showSceneEight() {
  $("#Scene8_text").text($Scene8_text);
  $("#a_good_rabbit_never_gives_up").hide(0);
  $("#Image_not_available").show($appear_and_fade_time);
}

function showCurrentScene() {
  $(".scene_text").hide(0);
  $("#Scene" + $scene + "_text").show($appear_and_fade_time);
  $(".scene_picture").hide(0);
  $("#Scene" + $scene + "_picture").show($appear_and_fade_time);
  if ($scene === 1) {
    showSceneOne();
  } else if ($scene === 2) {
    showSceneTwo();
  } else if ($scene === 3) {
    showSceneThree();
  } else if ($scene === 4) {
    showSceneFour();
  } else if ($scene === 5) {
    showSceneFive();
  } else if ($scene === 6) {
    showSceneSix();
  } else if ($scene === 7) {
    showSceneSeven();
  } else if ($scene === 8) {
    showSceneEight();
  }
}

function next() {
  $scene = $scene + 1;
  showCurrentScene();
  if ($scene === $totalNumScenes) {
    $("#next").each(function () {
      this.style.pointerEvents = "none";
    });
    $("#next").fadeOut($appear_and_fade_time);
  }
}

function back() {
  $scene = $scene - 1;
  showCurrentScene();
  $("#next").fadeIn($appear_and_fade_time);
  if ($scene === $totalNumScenes - 1) {
    $("#next").each(function () {
      this.style.pointerEvents = "auto";
    });
  }
}

function home() {
  $scene = 1;
  showCurrentScene();
  $("#next").each(function () {
    this.style.pointerEvents = "auto";
  });
  $("#next").fadeIn($appear_and_fade_time);
}