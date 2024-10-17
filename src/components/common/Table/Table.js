// frontend-dkmhhp/src/components/common/Table/Table.js
import React from 'react';
import Button from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Table.css';

const Table = ({ columns, data, onEdit, onDelete, idField = 'id' }) => {
  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item[idField]}>
              {columns.map((column) => (
                <td key={`${item[idField]}-${column.key}`}>
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td>
                  <div className="action-buttons">
                    {onEdit && (
                      <Button
                        className="edit-btn"
                        onClick={() => onEdit(item)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        className="delete-btn"
                        onClick={() => onDelete(item[idField])}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
