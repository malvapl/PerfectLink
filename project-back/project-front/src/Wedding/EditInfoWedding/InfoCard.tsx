import { Paper, TextField } from "@mui/material";
import { OptionCardData } from "./CustomInfo"

const InfoCard = (props: {
   data: OptionCardData,
   handleEdit: (data: OptionCardData) => void
}) => {

   return (<>
      {props.data.title !== '' && props.data.description !== '' &&
         <Paper className="p-3 m-3">
            <TextField
               fullWidth
               size='small'
               defaultValue={props.data.title}
               onChange={(e) => { props.handleEdit({ ...props.data, title: e.target.value }) }}
               inputProps={{ style: { fontSize: 23, textAlign: 'center' } }}
            />
            <textarea defaultValue={props.data.description} rows={3} onChange={(e) => {
               props.handleEdit({ ...props.data, description: e.target.value })
            }}></textarea>
         </Paper>
      }
   </>)
}

export default InfoCard