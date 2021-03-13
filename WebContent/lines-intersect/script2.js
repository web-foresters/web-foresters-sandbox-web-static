/*

FROM S.O. 

 */


// Check the direction these three points rotate
function RotationDirection(p1x, p1y, p2x, p2y, p3x, p3y) {
  if (((p3y - p1y) * (p2x - p1x)) > ((p2y - p1y) * (p3x - p1x)))
    return 1;
  else if (((p3y - p1y) * (p2x - p1x)) == ((p2y - p1y) * (p3x - p1x)))
    return 0;
  
  return -1;
}

function containsSegment(x1, y1, x2, y2, sx, sy) {
  if (x1 < x2 && x1 < sx && sx < x2) return true;
  else if (x2 < x1 && x2 < sx && sx < x1) return true;
  else if (y1 < y2 && y1 < sy && sy < y2) return true;
  else if (y2 < y1 && y2 < sy && sy < y1) return true;
  else if (x1 == sx && y1 == sy || x2 == sx && y2 == sy) return true;
  return false;
}

function hasIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  var f1 = RotationDirection(x1, y1, x2, y2, x4, y4);
  var f2 = RotationDirection(x1, y1, x2, y2, x3, y3);
  var f3 = RotationDirection(x1, y1, x3, y3, x4, y4);
  var f4 = RotationDirection(x2, y2, x3, y3, x4, y4);
  
  // If the faces rotate opposite directions, they intersect.
  var intersect = f1 != f2 && f3 != f4;
  
  // If the segments are on the same line, we have to check for overlap.
  if (f1 == 0 && f2 == 0 && f3 == 0 && f4 == 0) {
    intersect = containsSegment(x1, y1, x2, y2, x3, y3) || containsSegment(x1, y1, x2, y2, x4, y4) ||
    containsSegment(x3, y3, x4, y4, x1, y1) || containsSegment(x3, y3, x4, y4, x2, y2);
  }
  
  return intersect;
}

// Main call for checking intersection. Particularly verbose for explanation purposes.
function checkIntersection() {
  // Grab the values
  var x1 = parseInt($('#p1x').val());
  var y1 = parseInt($('#p1y').val());
  var x2 = parseInt($('#p2x').val());
  var y2 = parseInt($('#p2y').val());
  var x3 = parseInt($('#p3x').val());
  var y3 = parseInt($('#p3y').val());
  var x4 = parseInt($('#p4x').val());
  var y4 = parseInt($('#p4y').val());

  // Determine the direction they rotate. (You can combine this all into one step.)
  var face1CounterClockwise = RotationDirection(x1, y1, x2, y2, x4, y4);
  var face2CounterClockwise = RotationDirection(x1, y1, x2, y2, x3, y3);
  var face3CounterClockwise = RotationDirection(x1, y1, x3, y3, x4, y4);
  var face4CounterClockwise = RotationDirection(x2, y2, x3, y3, x4, y4);

  // If face 1 and face 2 rotate different directions and face 3 and face 4 rotate different directions, 
  // then the lines intersect.
  var intersect = hasIntersection(x1, y1, x2, y2, x3, y3, x4, y4);

  // Output the results.
  var output = "Face 1 (P1, P2, P4) Rotates: " + ((face1CounterClockwise > 0) ? "counterClockWise" : ((face1CounterClockwise == 0) ? "Linear" : "clockwise")) + "<br />";
  var output = output + "Face 2 (P1, P2, P3) Rotates: " + ((face2CounterClockwise > 0) ? "counterClockWise" : ((face2CounterClockwise == 0) ? "Linear" : "clockwise")) + "<br />";
  var output = output + "Face 3 (P1, P3, P4) Rotates: " + ((face3CounterClockwise > 0) ? "counterClockWise" : ((face3CounterClockwise == 0) ? "Linear" : "clockwise")) + "<br />";
  var output = output + "Face 4 (P2, P3, P4) Rotates: " + ((face4CounterClockwise > 0) ? "counterClockWise" : ((face4CounterClockwise == 0) ? "Linear" : "clockwise")) + "<br />";
  var output = output + "Intersection: " + ((intersect) ? "Yes" : "No") + "<br />";
  $('#result').html(output);


  // Draw the lines.
  var canvas = $("#canvas");
  var context = canvas[0].getContext('2d');
  context.clearRect(0, 0, canvas.get(0).width, canvas.get(0).height);
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.moveTo(x3, y3);
  context.lineTo(x4, y4);
  context.stroke();
}

checkIntersection();
