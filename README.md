# NewYoutubeVideos
I wanted to have all the new Youtube videos from subscribed channels sorted into playlists according to my preferences.
This script allows to put new videos from playlist or channel (channel playlist) to your own playlists.

# Set up
## Google Sheets
1. Go to [Google Sheets](https://docs.google.com/spreadsheets)
2. Create new spreadsheet
3. Copy ID of spreadsheet for later use
   - ID is in URL
   - Example: ID is 123456789 in URL https://docs.google.com/spreadsheets/d/123456789/edit?gid=0#gid=0
4. Add columns to sheet. Column names are not important but **their order is**
   - Channel Name
   - ChannelID
   - PlaylistID
   - PlaylistID to add videos
   - Last Video ID
   - Second To Last Video ID
   - Third To Last Video ID
5. Copy name of the sheet

## Google Apps Script
1. Go to [Google Apps Script](https://script.google.com/)
2. Create new project
3. Copy code from **NewYoutubeVideos.gs** to **Code.gs**
4. Add **YouTube Data API v3** to Services
5. In Project Settings add script property: SheetName
   - Property: SheetName
   - Value: [Copied name of the sheet](SpreadsheetID)
6. In Project Settings add script property: SpreadsheetID
   - Property: SpreadsheetID
   - Value: [Copied ID of spreadsheet](SpreadsheetID)
7. Add trigers to run script automatically every day
   - Function to run: MainFunction
   - Event source: Time-driven
   - Type of time based trigger: Day Timer
   - Time of day: 7pm to 8pm

## Youtube
1. Go to Youtube
2. Create new playlists on your channel
3. Copy ids of playlists from url
   - Example: ID is 123456789 in URL https://www.youtube.com/playlist?list=123456789

# Usage
Now we fill spreadsheet columns:
- Channel Name - Not required
  - Will be filled after first run
- **ChannelID - Required**
  - ID of youtube channel get by https://commentpicker.com/youtube-channel-id.php
- PlaylistID - Not required
  - You do not need to fill this out if you want all new videos from the channel, because it will be filled after first run
  - **If you want only new videos from specific playlist, then you need to fill this out**
- **PlaylistID to add videos - Required**
  - ID of youtube playlist to save new videos
- Last Video ID - Not required
  - Will be filled after first run
  - In first run it is going to add last 7 videos if you do not want that, you can fill this with last video ID you do **NOT** want
- Second To Last Video ID - Not required
  - Will be filled after first run
  - Only used if creater deletes their last video
- Third To Last Video ID - Not required
  - Will be filled after first run
  - Only used if creater deletes their last 2 videos
