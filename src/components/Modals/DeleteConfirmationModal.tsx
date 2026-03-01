import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { AlertTriangle, Trash2 } from 'lucide-react-native';
import LucideIconButton from '../IconButton/LucideIconButton';

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (id: any) => void;
  isDeleting?: boolean; // To show a loading state if needed
}

const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          {/* Warning Icon Section */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <AlertTriangle color="#FF3B30" size={32} />
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Delete This Item </Text>
            <Text style={styles.message}>
              Are you sure you want to delete this Item{' '}

            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isDeleting}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.deleteButton}
              onPress={onConfirm}
              disabled={isDeleting}
            >
              <Trash2 color="white" size={18} style={{ marginRight: 6 }} />
              <Text style={styles.deleteText}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity> */}
            <LucideIconButton
              icon='Trash2'
              containerColor={"#FF3B30"}
              onPress={onConfirm}
              text={isDeleting ? 'Deleting...' : 'Delete'}
              disabled={isDeleting}
              style={[styles.deleteButton]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});