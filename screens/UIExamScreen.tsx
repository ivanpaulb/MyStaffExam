import React from 'react';
import { View, StyleSheet } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';

const UIExamScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <VideoPlayer source="https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UIExamScreen;