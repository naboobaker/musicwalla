/*
 The MusicWallaTable is a reusable HTML table - the client adds/removes rows on
 the model, and this table automatically updates with model data.
 
 Calling the MusicWallaTable constructor will create the table and populate the
 rows and columns.  After calling this, all further table interaction should be
 done via the model.

 Parameters:
 - model: The MusicWallaTableModel object containing table data (column and row
        information) - this table will listen for changes on the model.

 - tableId: The ID, as a string, of the <table> element to populate, the header
        and row information will be populated.

 - actionRenderer: The function that will be called when a row's actions need to
        be rendered (e.g., delete, edit, etc.). The rendering function takes an
        id, returns an html snippet.

 - emptyMessage: The message, as a string, to render on the table when there
        are now rows to display.
*/
function MusicWallaTable(model, tableId, actionRenderer, emptyMessage) {
    this.model = model;
    this.tableId = tableId;
    this.actionRenderer = actionRenderer;
    this.emptyMessage = emptyMessage;

    // make a copy of the columns, for table-use
    this.columns = this.model.columns.slice(0);
    this.columns.splice(0,0, ""); // column for row number
    this.columns.push(""); // column for row actions

    // model change listener
    var listener = new Object();
    listener.table = this;
    listener.rowAdded = function(id) {
        var row = this.table.model.getRow(id);
        this.table.addRow(id, row);
    }
    listener.rowRemoved = function(id) {
        this.table.removeRow(id);
    }
    this.model.addListener(listener);

    // populate the table
    this.createTable();
    this.tableChanged();
}

/*
 Internal function to create the table, from the model.
*/
MusicWallaTable.prototype.createTable = function() {
    var tableId = this.tableId;
    var columns = this.columns;

    $("#" + tableId).empty();
    $("#" + tableId).append("<thead><tr></tr></thead><tbody></tbody>");

    // populate table header
    var headerRow = $("#" + tableId + " thead tr");
    for (var i = 0; i < columns.length; i++) {
        headerRow.append("<th>" + columns[i] + "</th>");
    }

    // populate table body
    for (var i = 0; i < this.model.getRowCount(); i++) {
        var row = this.model.getRowAt(i);
        var id =  this.model.getIdAt(i);
        this.addRow(id, row, this.actionRenderer, this.tableId);
    }
}

/*
 Internal function to add a row to the the table.
*/
MusicWallaTable.prototype.addRow = function(id, row) {
    var actionRenderer = this.actionRenderer;
    var tableId = this.tableId;

    // create the row
    var body = $("#" + tableId + " tbody");
    body.append("<tr id=\"" + tableId + "-row-" + id + "\"></tr>");

    // create the table cells in the row
    var bodyRow = $("#" + tableId + " tbody tr#" + tableId + "-row-" + id);
    bodyRow.append("<td id=\"row-number\"></td>") // row number
    for (var i = 0; i < row.length; i++) {
        bodyRow.append("<td>" + row[i] + "</td>")
    }
    bodyRow.append("<td>" + actionRenderer(id) + "</td>") // actions

    this.tableChanged();
}

/*
 Internal function to remove a from the the table.
*/
MusicWallaTable.prototype.removeRow = function(id) {
    var tableId = this.tableId;

    // remove row from table
    var row = $("#" + tableId + " tbody #" + tableId + "-row-" + id);
    if (row.length > 0) {
        row.remove();
        this.tableChanged();
    }
}

/*
 Internal function to do an processing needed after the table is changed.
*/
MusicWallaTable.prototype.tableChanged = function() {
    var tableId = this.tableId;
    var message = this.emptyMessage;
    var columnCount = this.columns.length;
    var rowCount = $("#" + tableId + " tbody tr").length;

    // if there is nothing in the table, give a message indicating an empty table
    // otherwise remove the message
    if (rowCount == 0) {
        $("#" + tableId + " tbody").append("<tr id=\"empty-row\"><td colspan=\"" + columnCount + "\">" + message + "</td></tr>");
    }
    else {
        $("#" + tableId + " tbody tr#empty-row").remove();
    }

    // update row numbers, since the table has changes
    $("#" + tableId + " tbody tr").each(function() {
        $this = $(this)
        var row = $this[0].rowIndex;
        $this.find("td#row-number").html(row);
    });
}
