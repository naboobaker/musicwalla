/*
 The MusicWallaTableModel is the model for a MusicWallaTable. It defines the
 column and row information for the table.  When rows are added/removed, events
 will be fired, and then listening table will reflect the changes.  Rows are
 made up arrays of cell data, with length equal to the number of columns.
 
 Parameters:
 - columns: An array of column names, as strings.  The length of this array
        also defines the number of columns in each row.
*/
function MusicWallaTableModel(columns) {
    this.columns = columns;
    this.rows = [];
    this.ids = [];
}

/*
 Add a row.
 
 Parameters:
 - id: ID of row being added.

 - data: Row data to add. This should be an array representing each table cell
        in the row (the length should be the same as the number of columns).
*/
MusicWallaTableModel.prototype.addRow = function(id, data) {
    this.ids.push(id);
    this.rows.push(data);
    this.fireRowAdded(id);
}

/*
 Removes the row data.
 
 Parameters:
 - id: ID of row to remove.
*/
MusicWallaTableModel.prototype.removeRow = function(id) {
    var index = this.getIndex(id);
    this.rows.splice(index,1);
    this.ids.splice(index,1);
    this.fireRowRemoved(id);
}

/*
 Get row data.
 
 Parameters:
 - id: ID of row to get data for.

 Return: The specified, row data. This is an array representing each table cell
        in the row.
*/
MusicWallaTableModel.prototype.getRow = function(id) {
    return this.getRowAt(this.getIndex(id));
}

/*
 Get the row data for the row at the given index.
 
 Parameters:
 - index: Index of row to get data for.

 Return: The specified, row data. This is an array representing each table cell
        in the row.
*/
MusicWallaTableModel.prototype.getRowAt = function(index) {
    return this.rows[index];
}

/*
 Get the row index for the specified ID.
 
 Parameters:
 - id: ID of row to get index for.

 Return: Index of row.
*/
MusicWallaTableModel.prototype.getIndex = function(id) {
    return this.ids.indexOf(id);
}

/*
 Get the row ID for the specified index.
 
 Parameters:
 - index: Index of row to get ID for.

 Return: ID of row.
*/
MusicWallaTableModel.prototype.getIdAt = function(index) {
    return this.ids[index];
}

/*
 Get the number of rows in the model.

 Return: Number of rows.
*/
MusicWallaTableModel.prototype.getRowCount = function() {
    return this.rows.length;
}

/*
 Add a listener for row added/removed events. There can be only one listener at
 a time (todo - fix this?)
 
 Parameters:
 - listener: The listener must have two functions, rowAdded(id) and
        rowRemoved(id).
*/
MusicWallaTableModel.prototype.addListener = function(listener) {
    this.listener = listener;
}

/*
 Internal function to fire an event when a row is removed.
*/
MusicWallaTableModel.prototype.fireRowRemoved = function(id) {
    if (this.listener && this.listener.rowRemoved) {
        this.listener.rowRemoved(id);
    }
}

/*
 Internal function to fire an event when a row is added.
*/
MusicWallaTableModel.prototype.fireRowAdded = function(id) {
    if (this.listener && this.listener.rowAdded) {
        this.listener.rowAdded(id);
    }
}