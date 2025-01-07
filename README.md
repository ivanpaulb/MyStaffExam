Sample video is https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4.

These are the main files:
1. App.tsx - This contains the sliding drawer controlled by gestures which allows user to switch between the 2 screens: UIExamScreen and NativeModuleExamScreen
   
2. UIExamScreen.tsx - This screen component is for the implementation for the Part: UI EXAM where it renders a custom video player component. For now, the source for the video is hard-coded because this is for exam purposes only so feel free to change the video source url.
   
3. VideoPlayer.tsx - This is the videoplayer component that includes the video player with play/pause button, the draggable progress bar displayed as series video thumbnail generated at regular intervals to reflect the video timeline. 
