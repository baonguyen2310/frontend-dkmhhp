import React, { useState, useEffect, useCallback } from 'react';
import './DataManagement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Notification/Notification';
import Modal from '../Modal';
import Button from '../Button';
import Spinner from '../Spinner';
import Table from '../Table';
import ConfirmationDialog from '../ConfirmationDialog';

const DataManagement = ({
  title,
  fetchData,
  addData,
  updateData,
  deleteData,
  initialDataState,
  columns,
  renderForm,
  disableAdd = false,
  disableEdit = false,
  disableDelete = false,
  idField = 'id',
  handleError
}) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(initialDataState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedData = await fetchData();
      setData(fetchedData);
    } catch (error) {
      console.error(`Error fetching ${title}:`, error);
      showNotification(`Failed to load ${title}.`, 'error');
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, title, handleError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setIsEditing(true);
    } else {
      setSelectedItem(initialDataState);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateData(selectedItem[idField], selectedItem);
        showNotification(`${title} updated successfully!`, 'success');
      } else {
        await addData(selectedItem);
        showNotification(`${title} added successfully!`, 'success');
      }
      await loadData();
      setIsModalOpen(false);
      setSelectedItem(initialDataState);
      setIsEditing(false);
    } catch (error) {
      console.error(`Error saving ${title}:`, error);
      showNotification(`Failed to save ${title}.`, 'error');
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsLoading(true);
      try {
        await deleteData(itemToDelete);
        await loadData();
        showNotification(`${title} deleted successfully!`, 'success');
      } catch (error) {
        console.error(`Error deleting ${title}:`, error);
        showNotification(`Failed to delete ${title}.`, 'error');
        handleError(error);
      } finally {
        setIsLoading(false);
        setIsConfirmDialogOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(initialDataState);
    setIsEditing(false);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="data-management-container">
      {isLoading && <Spinner />}
      <div className="data-management-content">
        <div className="data-list">
          <div className="list-header">
            <h3>{title} List</h3>
            {!disableAdd && (
              <Button icon={faPlus} className="add-btn" onClick={() => openModal()}>
                Add {title}
              </Button>
            )}
          </div>
          <Table
            columns={columns}
            data={data}
            onEdit={disableEdit ? null : openModal}
            onDelete={disableDelete ? null : handleDeleteClick}
            idField={idField}
          />
        </div>
      </div>
      {!disableAdd && !disableEdit && renderForm && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={isEditing ? `Edit ${title}` : `Add New ${title}`}
        >
          {renderForm({ handleSubmit, handleChange, selectedItem, isEditing, closeModal })}
        </Modal>
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete this ${title.toLowerCase()}?`}
        title="Confirm Deletion"
      />
    </div>
  );
};

export default DataManagement;
