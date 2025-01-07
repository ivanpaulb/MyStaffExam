import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

const { width } = Dimensions.get('window');

interface VideoPlayerProps {
  source: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<VideoRef>(null);
  const progressBarRef = useRef<View>(null);

  useEffect(() => {
    const generateThumbnails = async () => {
      setLoading(true);
      try {
        const interval = 3 ;
        const thumbs: string[] = [];
        for (let i = 0; i <= duration; i += interval) {
          const thumbnailPath = await generateThumbnail(source, i);
          thumbs.push(thumbnailPath);
        }
        setThumbnails(thumbs);
      } catch (error) {
        console.error('Error generating thumbnails:', error);
      } finally {
        setLoading(false);
      }
    };

    if (duration > 0) {
      generateThumbnails();
    }
  }, [duration, source]);

  const generateThumbnail = async (source: string, time: number): Promise<string> => {
    const output = `${RNFS.CachesDirectoryPath}/thumb_${time}.jpg`;
    const command = `-i ${source} -ss ${time} -vframes 1 ${output}`;
    await FFmpegKit.execute(command);
    return output;
  };

  const handleLoad = (meta: any) => {
    setDuration(meta.duration);
  };

  const handleProgress = (progress: any) => {
    setCurrentTime(progress.currentTime);
  };

  const handleSeek = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
  };

  const handlePanResponderMove = (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    if (progressBarRef.current) {
      const progressBarWidth = width - 40;
      const newTime = (gestureState.moveX / progressBarWidth) * duration;
      handleSeek(newTime);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
  });

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: source }}
        style={styles.video}
        paused={paused}
        onLoad={handleLoad}
        onProgress={handleProgress}
        resizeMode="contain"
      />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setPaused(!paused)}>
          <Text style={styles.buttonText}>{paused ? 'Play Video' : 'Pause Video'}</Text>
        </TouchableOpacity>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.progressBarContainer} {...panResponder.panHandlers}>
            <View ref={progressBarRef} style={styles.progressBar}>
              <View style={[styles.progress, { width: `${(currentTime / duration) * 100}%` }]} />
              <View style={styles.thumbnails}>
                {thumbnails.map((thumb, index) => (
                  <Image key={index} source={{ uri: `file://${thumb}` }} style={styles.thumbnail} />
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 160
  },
  video: {
    width: width,
    height: 200,
  },
  controls: {
    width: width - 40,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0000ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10
  },
  progressBarContainer: {
    width: width - 40,
    marginTop: 10,
  },
  progressBar: {
    height: 70,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#0000ff',
  },
  thumbnails: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  thumbnail: {
    width: 70,
    height: 60,
    marginRight: 3,
  },
});

export default VideoPlayer;