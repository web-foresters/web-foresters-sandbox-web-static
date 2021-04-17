/*

intersects() FROM: https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function

*/

function println(msg) {
	console.log(msg);
}

// returns true iff the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
}

function linesIntersect(line1, line2) {
    return intersects(line1.x1, line1.y1, line1.x2, line1.y2, line2.x1, line2.y1, line2.x2, line2.y2);
}

var lines = [
        { name: 'hor-1', x1: 20, y1: 40, x2: 80, y2: 40 },
        { name: 'hor-2', x1: 20, y1: 40, x2: 80, y2: 40 },
        { name: 'Amber-line-1', x1: 124, y1: 225, x2: 25, y2: 225 },
        { name: 'Amber-line-2', x1: 90, y1: 220, x2: 90, y2: 250 }
    ];


function checkLineIntersections() {
    println('Checking for line intersections');
    for (var i = 0; i < lines.length - 1; i++) {
        var line1 = lines[i];
        for (var j = i + 1; j < lines.length; j++) {
            var line2 = lines[j];
            var dbg = console && console.debug || debug;
            if (linesIntersect(line1, line2)) {
                dbg(line1.name + ' XX ' + line2.name, line1, line2);
            }
        }
    }
}

checkLineIntersections();
