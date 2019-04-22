  function getApi(room, start_date, end_date){
    fetch('https://online.ada.edu.az/rooms/api/events?token=ASj3krb0llf8pawAdrg4fjkr345nfm43&from='+start_date+'&to='+end_date+'&room='+room)
    .then(
      function(response) {
        if (response.status !== 200) {
          alert('Server Error. Status Code: ' + response.status);
          return;
        }
        response.json().then(function(data) {
          var date = new Date();
          date.setHours(10,15);  // showing real time
          var hours = date.getHours();
          var mins = date.getMinutes();

          for(var k in data) {
            var start_lesson = data[k].start_time.split(':', 2);
            var end_lesson = data[k].end_time.split(':', 2);

            start_lesson[0] = parseInt(start_lesson[0]);
            start_lesson[1] = parseInt(start_lesson[1]);
            end_lesson[0] = parseInt(end_lesson[0]);
            end_lesson[1] = parseInt(end_lesson[1]);

            if((((hours == start_lesson[0]) && (mins >= start_lesson[1])) ||
              (hours > start_lesson[0])) && (((hours == end_lesson[0]) &&
               (mins <= end_lesson[1])) || (hours < end_lesson[0]))){
                  var crs_data = data[k].title.split('-',2);
                  var course_desc = crs_data[0];
                  var course_name = crs_data[1];
                  cur_lesson = document.createElement('div');
                  cur_lesson.className = "cur_lesson";
                  cur_lesson.innerHTML = "<span class='room_num'>"+data[k].room+"</span>" + "<br>" +"<br>"
                   + "<span class='desc'>"+ course_desc + "</span>" + "<br>" + "<span class= 'name'>" + course_name+ "</span>" +"<br>"+"<br>"
                   +"<span class='tch'>"
                   + data[k].responsible 
                   +"</span>"
                    + "<hr>" 
                    +"<span class='dat'>"
                    + data[k].start_time.substr(0,5) + "-" + data[k].end_time.substr(0,5)+ "</span>";
            }
          }
          if (typeof(cur_lesson) === 'undefined') {
            cur_lesson = document.createElement('div');
            cur_lesson.className = "cur_lesson";
            cur_lesson.innerHTML = "<span class='empty_room'>" + room + "<br> Empty"+ "</span>";
          }
          document.getElementById('screen').appendChild(cur_lesson);
        });
      }
    )
    .catch(function(err) {
      alert('Error :', err);
    });
  }
  function findGetParameter(parameterName) {
      var result = null,
      tmp = [];
      location.search
          .substr(1)
          .split("&")
          .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
          });
      return result;
  }
  var parameter = findGetParameter('room');
  if(parameter !== null){
    var fromDate = new Date();
    var toDate = new Date(fromDate.getTime() + 86400000); //changed this (fromDate.getTime)
    var start_date = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate(); // Vaxti yenilemek ucun--today
    var end_date = toDate.getFullYear() + "-" + (toDate.getMonth()+1) + "-" + toDate.getDate(); // Vaxti yenilemek ucun-tomorrow
    getApi(parameter, start_date, end_date);
  } else {
    document.getElementById('screen').innerHTML = "<center>Please add a get parameter (room) to the link. Example: ?room=A102</center>";
  }
