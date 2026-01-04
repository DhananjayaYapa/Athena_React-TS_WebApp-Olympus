import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import styles from './Accordion.module.scss'

const AccordionMenu: React.FC<{
  icon: any
  title: string
  children?: React.ReactNode
}> = (props) => {
  const MainIcon = props.icon

  return (
    <Accordion className={styles.Accordion}>
      <AccordionSummary
        className={styles.root}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <span className={styles.navItemTitle}>
          {' '}
          <MainIcon className={styles.mainIcon} /> <p className={styles.title}>{props.title}</p>
        </span>
      </AccordionSummary>
      <AccordionDetails className={styles.accordionDetails}>{props.children}</AccordionDetails>
    </Accordion>
  )
}

export default AccordionMenu
