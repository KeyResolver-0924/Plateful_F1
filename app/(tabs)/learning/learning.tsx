import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import HeaderProfile from '../../../components/common/HeaderProfile';
import { colors } from '../../../constants/colors';

import LearningModuleTab from './components/LearningModuleTab';
import QuestsTab from './components/QuestsTab';
import { QuestProvider } from './context/QuestContext';

interface NavigationProp {
  navigate: (screen: string) => void;
}

interface LearningModuleScreenProps {
  navigation?: NavigationProp;
}

type TabType = 'food' | 'learning';

const LearningModuleScreen: React.FC<LearningModuleScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('food');

  return (
    <QuestProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <HeaderProfile />
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'food' && styles.tabActive]}
              onPress={() => setActiveTab('food')}
            >
              <Text style={[styles.tabText, activeTab === 'food' && styles.tabTextActive]}>
                Quests
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'learning' && styles.tabActive]}
              onPress={() => setActiveTab('learning')}
            >
              <Text style={[styles.tabText, activeTab === 'learning' && styles.tabTextActive]}>
                Learning Module
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {activeTab === 'learning' && (
            <LearningModuleTab navigation={navigation} />
          )}

          {activeTab === 'food' && (
            <QuestsTab />
          )}
        </View>


      </View>
    </QuestProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});

export default LearningModuleScreen;
