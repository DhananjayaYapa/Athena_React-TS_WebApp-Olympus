import React from 'react'
import styles from './TaskRemovePopup.module.scss'
import Alert from '@mui/material/Alert'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface task {
  [key: string]: string
}

const TaskRemovePopup: React.FC<{
  open: boolean
  isLoading: boolean
  taskListHistory: task[]
  onClose: () => void
  onDeleteTask: (task: string) => void
}> = (props) => {
  const handleCancel = () => {
    props.onClose()
  }

  const removeTask = (task: string) => {
    props.onDeleteTask(task)
  }

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" open={props.open}>
        <DialogTitle className={styles.summaryPopUpTitle}>
          <div>
            <h3>Remove Task Suggestions</h3>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={4} className="content-padding">
            <Grid size={{ md: 12 }} className={styles.alertHolder}>
              {/* <p className={styles.summaryDesc}>You can delete task suggestions displayed in manage time entries window via this section.</p>
                            <br/> */}
              <Alert severity="info">You can delete task suggestions via this section</Alert>
            </Grid>
            <Grid size={{ md: 12 }}>
              <div className={styles.demo}>
                {props.taskListHistory && props.taskListHistory.length === 0 ? (
                  <h3 className={styles.noData}>No tasks available</h3>
                ) : (
                  ''
                )}
                <List dense={false}>
                  {props.taskListHistory.length > 0 &&
                    props.taskListHistory.map((task, index) => (
                      <ListItem className={styles.taskItem} key={index}>
                        <ListItemText primary={task.task} secondary={null} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              removeTask(task.task)
                            }}
                          >
                            <DeleteIcon className={styles.delete} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                </List>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default TaskRemovePopup
