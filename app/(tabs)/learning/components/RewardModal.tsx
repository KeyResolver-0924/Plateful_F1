import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../../../../constants/colors';

const { width } = Dimensions.get('window');

interface Rewards {
  stars: number;
  badges: string[];
  prizes: string[];
}

interface RewardModalProps {
  visible: boolean;
  rewards: Rewards | null;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ visible, rewards, onClose }) => {
  const boxOpenAnimation = useSharedValue(0);
  const starsAnimation = useSharedValue(0);
  const badgeAnimation = useSharedValue(0);

  React.useEffect(() => {
    if (visible && rewards) {
      animateRewards();
    } else {
      resetAnimations();
    }
  }, [visible, rewards]);

  const animateRewards = () => {
    boxOpenAnimation.value = withSpring(1);
    setTimeout(() => {
      starsAnimation.value = withSpring(1.2);
      setTimeout(() => {
        starsAnimation.value = withSpring(1);
      }, 200);
    }, 300);
    setTimeout(() => {
      badgeAnimation.value = withSpring(1);
    }, 600);
  };

  const resetAnimations = () => {
    boxOpenAnimation.value = 0;
    starsAnimation.value = 0;
    badgeAnimation.value = 0;
  };

  const handleClose = () => {
    resetAnimations();
    onClose();
  };

  const animatedStarsStyle = useAnimatedStyle(() => ({
    opacity: starsAnimation.value,
    transform: [{ scale: starsAnimation.value }]
  }));

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    opacity: badgeAnimation.value,
    transform: [{ scale: badgeAnimation.value }]
  }));

  if (!rewards) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={styles.rewardModal} entering={ZoomIn}>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={handleClose}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <Text style={styles.rewardTitle}>🎉 Treasure Unlocked! 🎉</Text>
          <Text style={styles.congratsText}>
            Congratulations! You've completed all sub-rounds and unlocked the treasure box!
          </Text>
          
          <View style={styles.rewardsContent}>
            <Animated.View style={[styles.rewardItem, animatedStarsStyle]}>
              <Ionicons name="star" size={32} color="#FFD700" />
              <Text style={styles.rewardText}>+{rewards.stars} Stars</Text>
            </Animated.View>

            <Animated.View style={[styles.rewardItem, animatedBadgeStyle]}>
              <Ionicons name="medal" size={32} color="#FF6B6B" />
              <Text style={styles.rewardText}>
                {Array.isArray(rewards.badges) ? rewards.badges[0] : 'New Badge!'}
              </Text>
            </Animated.View>

            <Animated.View style={[styles.rewardItem, animatedBadgeStyle]}>
              <Ionicons name="gift" size={32} color="#4CAF50" />
              <Text style={styles.rewardText}>
                {Array.isArray(rewards.prizes) ? rewards.prizes[0] : 'Special Prize!'}
              </Text>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: width - 60,
    alignItems: 'center',
  },
  closeModalButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  rewardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  congratsText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  rewardsContent: {
    alignItems: 'center',
    gap: 15,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    minWidth: 200,
    justifyContent: 'center',
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});

export default RewardModal;
