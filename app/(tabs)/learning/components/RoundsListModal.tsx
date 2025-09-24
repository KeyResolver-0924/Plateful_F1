import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { colors } from '../../../../constants/colors';
import { Round } from '../types/navigation';

const { width } = Dimensions.get('window');

interface RoundsListModalProps {
  visible: boolean;
  rounds: Round[];
  roundPositions: { [key: number]: number };
  onClose: () => void;
  onRoundSelect: (roundIndex: number) => void;
}

const RoundsListModal: React.FC<RoundsListModalProps> = ({
  visible,
  rounds,
  roundPositions,
  onClose,
  onRoundSelect
}) => {
  const handleRoundSelect = (roundIndex: number) => {
    onRoundSelect(roundIndex);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={styles.roundsListModal} entering={ZoomIn}>
          <View style={styles.roundsListHeader}>
            <Text style={styles.roundsListTitle}>All Rounds</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 400 }}>
            {rounds.map((round, idx) => {
              const completed = round.isCompleted;
              const unlocked = !round.isLocked;
              return (
                <TouchableOpacity
                  key={round.id}
                  style={styles.roundsListItem}
                  disabled={!unlocked}
                  onPress={() => handleRoundSelect(idx)}
                >
                  <Text style={[styles.roundsListItemText, !unlocked && { opacity: 0.5 }]}>
                    Round {idx + 1}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {completed ? (
                      <Ionicons name="checkmark-circle" size={20} color="#58cc02" />
                    ) : unlocked ? (
                      <Ionicons name="ellipse-outline" size={18} color={colors.text.secondary} />
                    ) : (
                      <Ionicons name="lock-closed" size={18} color={colors.text.secondary} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
  roundsListModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: width - 60,
  },
  roundsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roundsListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  roundsListItem: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roundsListItemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
});

export default RoundsListModal;
