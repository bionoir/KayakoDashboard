/**
 * @author fda
 */
kayakodashboard.controller("KayakoMainPageController", function($scope, $log, $http, $q) {
	
	$scope.mainuser = 'Fabio';
	var kayakoStatuses = {};
	var ticketstatusid;
	var ticketscountbyid;
	var ticketscountbyidstatus = new Object();
    var totalOfTickets = 0;
    var percentageOfTicketsByStatus = new Object();
    var arcColors = ["red","yellow","green","blue","orange","magenta","turquoise","crimson","deeppink","lime","grey","sienna","purple","tomato","steelblue"];

	var url_head = 'https://servicedesk.secutix.com/api/index.php?e=';
	var url_completion='&apikey=6af177eb-e6f8-9a74-2929-6e02e6ea8918&salt=1649972308&signature=8Gx9S%2F%2FofWKSmSAoLB2K6w143iZLkYN0YqtAsAfk3Ss%3D';
	
	
	
	/* Getting ticket statuses */
	var url = url_head + '/Tickets/TicketStatus' + url_completion;
	/*$http.get(url)
		.success(function(data) {
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(data,"text/xml");					
			var xmlRawStatuses =  xmlDoc.getElementsByTagName("ticketstatus");
			var i;

            for (i = 0; i < xmlRawStatuses.length; i++) {
                var id_key = xmlRawStatuses[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
                var stat_name = xmlRawStatuses[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;

                kayakoStatuses[id_key] = stat_name;
            }

			
			$scope.kayakostatuses = kayakoStatuses;
		})
		.error(function(data){
			console.log(data);
		});
	*/
	/* Get the totals of tickets */
	/*url = url_head + '/Tickets/TicketCount' + url_completion;
	$http.get(url)
		.success(function(data) {
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(data,"text/xml");
			var xmlRawTicketsCountByStatuses = xmlDoc.getElementsByTagName('statuses');
			
			var i;
			
			for (i = 0; i < xmlRawTicketsCountByStatuses.length; i++) {
				var j;
				
				for (j = 0; j < xmlRawTicketsCountByStatuses[i].children.length; j++) {
					
					//ticketsCountByStatuses.push(xmlRawTicketsCountByStatuses[i].children[j].outerHTML);
					var el = document.createElement( 'html' );
					el.innerHTML =  xmlRawTicketsCountByStatuses[i].children[j].outerHTML;
					
					ticketstatusid = el.getElementsByTagName("ticketstatus")[0].getAttribute("id");
					ticketscountbyid = el.getElementsByTagName("ticketstatus")[0].getAttribute("totalitems");
					
					ticketscountbyidstatus[ticketstatusid] = ticketscountbyid;
				}
				
			}
			
			$scope.ticketscount = ticketscountbyidstatus;
		})
		.error(function(data){
			console.log(data);
		});
	*/


    function searchTicketStatus(){
        url = url_head + '/Tickets/TicketStatus' + url_completion;
        return $http.get(url).then(function(data){
            return data;
        }, function(data){
            console.log(data);
        });
    }

    function searchTicketsCountByStatusID(){
        url = url_head + '/Tickets/TicketCount' + url_completion;
        return $http.get(url).then(function(data){
            return data;
        }, function(data){
            console.log(data);
        });
    }

    $q.all([searchTicketStatus(),searchTicketsCountByStatusID()]).then(function(arrayResults){
        var searchTicketStatus = arrayResults[0],
            searchTicketsCountByStatusID = arrayResults[1],
            parser,
            xmlDoc,
            xmlRawStatuses,
            xmlRawTicketsCountByStatuses,
            i;

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(searchTicketStatus.data,"text/xml");
        xmlRawStatuses =  xmlDoc.getElementsByTagName("ticketstatus");

        for (i = 0; i < xmlRawStatuses.length; i++) {
            var id_key = xmlRawStatuses[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
            var stat_name = xmlRawStatuses[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;

            kayakoStatuses[id_key] = stat_name;
        }

        xmlDoc = parser.parseFromString(searchTicketsCountByStatusID.data,"text/xml");
        xmlRawTicketsCountByStatuses = xmlDoc.getElementsByTagName('statuses');


        for (i = 0; i < xmlRawTicketsCountByStatuses.length; i++) {
            var j;

            for (j = 0; j < xmlRawTicketsCountByStatuses[i].children.length; j++) {

                var el = document.createElement('html');
                el.innerHTML = xmlRawTicketsCountByStatuses[i].children[j].outerHTML;

                ticketstatusid = el.getElementsByTagName("ticketstatus")[0].getAttribute("id");
                if (kayakoStatuses[ticketstatusid] != "Closed") {
                    ticketscountbyid = el.getElementsByTagName("ticketstatus")[0].getAttribute("totalitems");

                    ticketscountbyidstatus[ticketstatusid] = ticketscountbyid;
                }
            }

        }

        for (var indice in ticketscountbyidstatus) {
            totalOfTickets = totalOfTickets + parseInt(ticketscountbyidstatus[indice]);
        }

        for (var indice in ticketscountbyidstatus){
            var statusKey = kayakoStatuses[indice];

            percentageOfTicketsByStatus[statusKey] = parseFloat(ticketscountbyidstatus[indice]) / totalOfTickets;
        }

        $scope.searchTicketStatus = searchTicketStatus;
        $scope.searchTicketsCountByStatusID = searchTicketsCountByStatusID;
        $scope.totaloftickets = totalOfTickets;

        /* Partie qui réalise les dessins dans les balises canvas de la vue contrôlée */
        /* CANVAS */
        var canvas = document.getElementById('doughnut1');
        var context = canvas.getContext('2d');

        $scope.data = [];
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = 120;
        var startAngle = 1.1 * Math.PI;
        var endAngle = 1.9 * Math.PI;
        var colorIndex = 0;

        $scope.centerx = centerX;
        $scope.centery = centerY;

        /*
        context.beginPath();
        context.fillRect(centerX,centerY,5,5);
        context.stroke();*/

        startAngle = 0;
        endAngle = 0;
        for (var indice in percentageOfTicketsByStatus) {
            startAngle = endAngle;
            endAngle = endAngle + (2.0 * percentageOfTicketsByStatus[indice]);

            context.beginPath();
            context.arc(centerX, centerY, radius, startAngle * Math.PI, endAngle * Math.PI, false);
            context.lineWidth = 20;
            context.strokeStyle = arcColors[colorIndex];
            context.stroke();

            colorIndex = colorIndex + 1;
        }

        /* PIE CHART for the second canvas test*/
        canvas = document.getElementById('piechart1');
        context = canvas.getContext('2d');
        centerX = canvas.width / 2;
        centerY= canvas.height / 2;

        startAngle = 0;
        endAngle = 0;
        colorIndex = 0;
        for (var indice in percentageOfTicketsByStatus) {
            startAngle = endAngle;
            endAngle = endAngle + (2.0 * percentageOfTicketsByStatus[indice]);

            context.fillStyle = arcColors[colorIndex];
            context.beginPath();
            context.moveTo(centerX,centerY);
            context.arc(centerX, centerY, radius, startAngle * Math.PI, endAngle * Math.PI, false);
            context.moveTo(centerX,centerY);
            context.fill();

            colorIndex = colorIndex + 1;
        }

    });

});