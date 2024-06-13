function MainFunction() {
  //For use of this script you need to create google sheet
  var spreadsheetID = getScriptSecret("SpreadsheetID");
  //It is necessary to have one sheet in google sheet
  var sheetName = getScriptSecret("SheetName");
  //Specifies the number of videos to check from playlist/channel
  var maxVideosToCheckPerPlaylist = 7;

  var playlistSheet = SpreadsheetApp.openById(spreadsheetID).getSheetByName(sheetName);

  //Channel Name
  var channelNameIndex = 1;
  //ChannelID - values must be filled
  var channelIDIndex = 2;
  //PlaylistID
  var playlistIDIndex = 3;
  //PlaylistID to add videos - values must be filled
  var playlistToSaveVideoIndex = 4;
  //Last Video ID
  var lastVideoIDIndex = 5;
  //Second To Last Video ID
  var secondToLastVideoIDIndex = 6;
  //Third To Last Video ID
  var thirdToLastVideoIDIndex = 7;

  //First row is header
  var startRow = 2;
  var lastRow = playlistSheet.getLastRow();

  FillDataToSpreadsheet(playlistSheet, channelNameIndex, channelIDIndex, playlistIDIndex, startRow, lastRow);
  AddNewVideosToPlaylist(playlistSheet, playlistIDIndex, playlistToSaveVideoIndex, lastVideoIDIndex, secondToLastVideoIDIndex, thirdToLastVideoIDIndex, maxVideosToCheckPerPlaylist, startRow, lastRow);
}
function getScriptSecret(key) {
  let secret = PropertiesService.getScriptProperties().getProperty(key)
  if (!secret) throw Error(`Secret ${key} is empty`)
  return secret
}
//Fills ChannelName and PlaylistID to sheet
function FillDataToSpreadsheet(playlistSheet, channelNameIndex, channelIDIndex, playlistIDIndex, startRow, lastRow)
  {
    for (var row = startRow; row <= lastRow; row++) {
      FillChannelName(playlistSheet, row, channelNameIndex, channelIDIndex);
      FillPlaylistID(playlistSheet, row, playlistIDIndex, channelIDIndex);
    }
  }
//Finds (if empty) Channel Name by ChannelID and fills it to sheet
function FillChannelName(playlistSheet, row, channelNameIndex, channelIDIndex) 
  {
    if (playlistSheet.getRange(row, channelNameIndex).getValue() == "") {
      var channelId = playlistSheet.getRange(row, channelIDIndex).getValue();
      var results = YouTube.Channels.list('id,snippet', {
        id: channelId,
        maxResults: 1,
      });

      playlistSheet.getRange(row, channelNameIndex).setValue(results.items[0].snippet.title);
    }
  }
//Finds (if empty) Channel Name by ChannelID and fills it to sheet
function FillPlaylistID(playlistSheet, row, playlistIDIndex, channelIDIndex) 
 {
   if (playlistSheet.getRange(row, playlistIDIndex).getValue() == "") {
      var channelId = playlistSheet.getRange(row, channelIDIndex).getValue();
      var results = YouTube.Channels.list('id,contentDetails', {
        id: channelId,
        maxResults: 1,
      });

      playlistSheet.getRange(row, playlistIDIndex).setValue(results.items[0].contentDetails.relatedPlaylists.uploads);
    }
 }
//Finds new videos from in playlist/channel
function AddNewVideosToPlaylist(playlistSheet, playlistIDIndex, playlistToSaveVideoIndex, lastVideoIDIndex, secondToLastVideoIDIndex, thirdToLastVideoIDIndex, maxVideosToCheckPerPlaylist, startRow, lastRow)
  {
    for (var row = startRow; row <= lastRow; row++)
    {
      var playlistID = playlistSheet.getRange(row, playlistIDIndex).getValue();
      var playlistToSaveVideoID = playlistSheet.getRange(row, playlistToSaveVideoIndex).getValue();
      var lastVideoID = playlistSheet.getRange(row, lastVideoIDIndex).getValue();
      var secondToLastVideoID = playlistSheet.getRange(row, secondToLastVideoIDIndex).getValue();
      var thirdToLastVideoID = playlistSheet.getRange(row, thirdToLastVideoIDIndex).getValue();
    
    //Get most recent X videos from playlist
    var results = YouTube.PlaylistItems.list('id,snippet', {
      playlistId: playlistID,
      maxResults: maxVideosToCheckPerPlaylist,
      order: "date"
    });

      for (var videoId = 0; videoId < maxVideosToCheckPerPlaylist; videoId++)
        {
          //If video was already seen in previous run of this script then stop adding videos
          if (lastVideoID.indexOf(results.items[videoId].snippet.resourceId.videoId) > -1)
          {
            break;
          }
          if(secondToLastVideoID.indexOf(results.items[videoId].snippet.resourceId.videoId) > -1)
          {
            break;
          }
          if(thirdToLastVideoID.indexOf(results.items[videoId].snippet.resourceId.videoId) > -1)
          {
            break;
          }
          else {
              var details = { videoId: results.items[videoId].snippet.resourceId.videoId, kind: 'youtube#video' };
              var resource = { snippet: { playlistId: playlistToSaveVideoID, resourceId: details } };
              
              //Add video to playlist
              try {
                YouTube.PlaylistItems.insert(resource, 'snippet');
              }
              catch (e) {
                if (e.toString().indexOf("Video already in playlist") > -1) { }
                else if (e.toString().indexOf("Video not found") > -1) { }
                else if (e.toString().indexOf("Resource type not supported") > -1) { }
                else { }
              }
          }
        }
      //Save IDs of last 3 videos for future runs of the script
      //Save more than 1 because of possibility of creator deleting video
      playlistSheet.getRange(row, lastVideoIDIndex).setValue(results.items[0].snippet.resourceId.videoId);
      playlistSheet.getRange(row, secondToLastVideoIDIndex).setValue(results.items[1].snippet.resourceId.videoId);
      playlistSheet.getRange(row, thirdToLastVideoIDIndex).setValue(results.items[2].snippet.resourceId.videoId);
    }
  }