import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../../constants/colors';
import { countries, searchCountries } from '../../constants/countries';

const CountryPicker = ({ 
  selectedCountry, 
  onSelectCountry, 
  style 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = searchCountries(query);
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  };

  const handleSelectCountry = (country) => {
    onSelectCountry(country);
    setModalVisible(false);
    setSearchQuery('');
    setFilteredCountries(countries);
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleSelectCountry(item)}
    >
      <View style={styles.countryInfo}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.countryDetails}>
          <Text style={styles.countryName}>{item.name}</Text>
          <Text style={styles.callingCode}>{item.callingCode}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.flagButton, style]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flagText}>
          {selectedCountry ? selectedCountry.flag : '🇺🇸'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.text.primary} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <FlatList
              data={filteredCountries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              style={styles.countryList}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  flagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  flagText: {
    fontSize: 20,
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryDetails: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 2,
  },
  callingCode: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});

export default CountryPicker; 