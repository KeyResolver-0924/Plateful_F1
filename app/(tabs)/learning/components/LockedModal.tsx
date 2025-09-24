import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { colors } from '../../../../constants/colors';

const { width } = Dimensions.get('window');

interface LockedModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const LockedModal: React.FC<LockedModalProps> = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View entering={ZoomIn} style={styles.lockedModal}>
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.lockedTitle}>{title}</Text>
          <Text style={styles.lockedModalMessage}>{message}</Text>
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedBadgeText}>LOCKED</Text>
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
  lockedModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 26,
    width: width - 60,
    alignItems: 'center',
  },
  closeModalButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  lockedModalMessage: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  lockedBadge: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  lockedBadgeText: {
    color: '#888',
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default LockedModal;
