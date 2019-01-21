var query_count = 0;
var query;
var timer;

var QUERY_PLACEHOLDER = "Query Your Data"
var DATA_LOCATION = "Directory or URL"
var DATA_NAME = "Saved Table Name"

var queries = {};

function getSavedTables(){
    $.ajax({
        type: 'GET',
        url: '/tables',
        contentType: "application/json; charset=utf-8",
        success: function(data, status) {
            data = eval(data);
            var th = true;
            var header = "";

            $("#previous_tables").append('<div id="query-previousTables"><table id="previousTables" class="display" width="100%"></table></div>');
            if(data.length > 0){
                $.each(data, function(){
                    header += (th ? "<thead><tr>" : "<tr>");
                    for (var key in $(this)[0]){
                        header += "<" + (th ? "th" : "td") + ">" + (th ? key : $(this)[0][key]) + "</" + (th ? "th" : "td") + ">";
                    }
                    header += (th ? "</thead></tr><tbody>" : "</tr>");
                    if(th){
                        for (var key in $(this)[0]){
                            header += "<td>" + $(this)[0][key] + "</td>";
                        }
                    }
                    th = false;
                });
                header += "</tbody>";
                $("#previousTables").html(header);
                $("#previousTables").DataTable();
            } else {
                $("#previousTables").html("<thead><th>No Previously Saved Tables</th><tbody></tbody>");
                $("#previousTables").DataTable();
                $("#previousTables_paginate").hide();
                $("#previousTables_info").hide();
            }

        },
        error: function() {
            console.log("Error retrieving existing tables");
        }
    });
}

function saveTable(){
    $(".alert").hide();
    $("#saveTable").html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
    $.ajax({
        type: 'POST',
        url: '/saveData',
        data: "empty",
        contentType: "application/json; charset=utf-8",
        success: function(data, status){
            $(".alert-success").slideToggle();
            getSavedTables();
            $("#saveTable").html('Save');
        },
        error: function(data, status){
            $(".alert-warning").slideToggle();
            $("#saveTable").html('Save');
        }
    });
}

$(document).ready(function() {
    $("#query").attr("placeholder", QUERY_PLACEHOLDER);
    $("#data_location").attr("placeholder", DATA_LOCATION);
    $("#data_name").attr("placeholder", DATA_NAME);

    getSavedTables();

    $("#query").keydown(function(e) {
        if (e.keyCode == 13 && $(this).val().length  > 0) {
            query = $(this).val();
            $("#query").val("");
            $("#query").attr("placeholder",query);
            timer = window.setInterval(function(){
                $("#query").attr("placeholder",$("#query").attr("placeholder") + ".");
            }, 1000);

            $.ajax({
                type: 'POST',
                url: '/sql',
                data: query,
                contentType: "application/json; charset=utf-8",
                success: function(data, status) {
                    data = eval(data);
                    var th = true;
                    var header = "";
                    $("#query-data-table").remove();

                    $("#results").prepend('<div id="query-data-table' + '"><div class="past-query" >' + query + '</div><table id="data-table" class="display" cellspacing="0" width="100%"></table></div>');
                    $.each(data, function(){
                        header += (th ? "<thead><tr>" : "<tr>");
                        for (var key in $(this)[0]){
                            header += "<" + (th ? "th" : "td") + ">" + (th ? key : $(this)[0][key]) + "</" + (th ? "th" : "td") + ">";
                        }
                        header += (th ? "</thead></tr><tbody>" : "</tr>");
                        if(th){
                            for (var key in $(this)[0]){
                                header += "<td>" + $(this)[0][key] + "</td>";
                            }
                        }
                        th = false;
                    });
                    header += "</tbody>";
                    queries[query] = header;
                    $("#query_rows").append("<tr><td>" + query + "</td><td> Go </td></tr>")
                    $("#data-table").html(header);

                    $("#data-table").DataTable();
                    query_count ++;
                    $("#query").attr("placeholder", QUERY_PLACEHOLDER);
                    clearInterval(timer);
                    getSavedTables();
                },
                error: function() {
                    clearInterval(timer);
                    $("#query").attr("placeholder","Error: " + query);
                }
            })
        }
    });

    $("#data_location").bind('blur keyup', function(e) {
        if ((e.keyCode == 13 || e.type == "blur") && $(this).val().length  > 0) {
            data_location = $(this).val();

            $.ajax({
                type: 'POST',
                url: '/location',
                data: data_location,
                contentType: "application/json; charset=utf-8",
                success: function(data, status) {
                    if(data == "true"){
                        $("#data_location").val("");
                        $("#data_location").attr("placeholder", data_location);
                    }else{
                        $("#data_location").val("");
                        $("#data_location").attr("placeholder","Error setting data location");
                    }
                }
            })
        }
    });

    $("#data_name").bind('blur keyup', function(e) {
        if ((e.keyCode == 13 || e.type == "blur") && $(this).val().length > 0) {
            data_name = $(this).val();

            $.ajax({
                type: 'POST',
                url: '/table',
                data: data_name,
                contentType: "application/json; charset=utf-8",
                success: function(data, status) {
                    if(data == "true"){
                        $("#data_name").val("");
                        $("#data_name").attr("placeholder", data_name);
                    }else{
                        $("#data_name").val("");
                        $("#data_name").attr("placeholder","Error setting table name");
                    }
                }
            })
        }
    });
});
