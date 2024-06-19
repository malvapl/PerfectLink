import '../../styles.css'
import { IGuest, ITable } from './SpaceTables'
import { useEffect, useState } from 'react';
import { Circle, Group, Text } from 'react-konva';
import theme from '../../theme/theme';
import { IPopoverSeat } from './AppTables';

export interface ISeat {
   guest: IGuest;
   position: { x: number, y: number }; // relative
}

const Table = (props: {
   data: ITable,
   index: number,
   updateTable: (table: ITable) => void
   editTable: (table: ITable) => void
   showSeat: (ps: IPopoverSeat) => void
   // setOver: boolean
}) => {

   const [table, setTable] = useState<ITable>(props.data)
   const [radius, setRadius] = useState<number>(0)
   // const [opacity, setOpacity] = useState<number>(1)

   function sinDegrees(angle: number): number {
      return Math.sin(angle * Math.PI / 180);
   }

   function cosDegrees(angle: number): number {
      return Math.cos(angle * Math.PI / 180);
   }

   const [seats, setSeats] = useState<ISeat[]>([])

   useEffect(() => {
      setRadius(table.maxChairs * 10)
      setTable(props.data)

      const generateSeatPosition = (seatCount: number, maxChairs: number): { x: number, y: number } => {
         const angle = 360 / maxChairs * seatCount;
         const rad = radius + maxChairs;
         const y = Math.round(rad * cosDegrees(angle));
         const x = Math.round(rad * sinDegrees(angle));
         return { x, y };
      };

      const newSeats: ISeat[] = [];
      for (let i = 0; i < table.maxChairs; i++) {

         newSeats.push({
            guest: { id: -1, name: '', numSeat: i, plusOne: '', group: '', isPlusOne: false },
            position: generateSeatPosition(i, table.maxChairs)
         })
      }
      table.guests?.forEach(guest => {
         newSeats[guest.numSeat].guest = guest;
      });
      setSeats(newSeats)
   }, [table.guests, table.maxChairs, radius, props.data])

   // useEffect(() => {
   //    setOpacity(props.setOver ? 0.7 : 1)
   // }, [props.setOver])


   return (
      <Group x={table.pos_x} y={table.pos_y} draggable
         onDragEnd={e => {
            const pos = e.target.getPosition();
            props.updateTable({ ...table, pos_x: pos.x, pos_y: pos.y })
         }}
         // opacity={opacity}
         onMouseEnter={e => {
            const container = e.target.getStage()!.container();
            container.style.cursor = "move";
         }}
         onMouseLeave={e => {
            const container = e.target.getStage()!.container();
            container.style.cursor = "default";
         }}
         onDblClick={() => {
            props.editTable(table)
         }}
      >
         {/* TABLE */}
         <Circle
            radius={radius}
            fill='white'
            stroke={'lightgrey'}
            strokeWidth={1}

         />
         <Text text={table.name?.toUpperCase()}
            fontFamily={theme.typography.fontFamily}
            fontSize={15}
            fill="black"
            align='center'
            x={-radius}
            y={-10}
            width={radius * 2}
         />
         {/* SEATS */}
         {seats.map((seat, index) => (
            <Circle
               key={index}
               x={seat.position.x}
               y={-seat.position.y}
               radius={20}
               fill={seat.guest?.name !== '' ? 'lightgreen' : 'lightgray'}
               stroke={'grey'}
               strokeWidth={1}
               dash={seat.guest?.name !== '' ? undefined : [5, 5]}
               onMouseOver={(e) => {
                  if (seat.guest.id === -1) return
                  props.showSeat({
                     guest: seat.guest,
                     position: e.target.getAbsolutePosition(),
                     open: true
                  })
               }}
               onMouseLeave={() => {
                  props.showSeat({
                     guest: { id: -1, name: '', numSeat: -1, plusOne: '', group: '', isPlusOne: false },
                     position: { x: 0, y: 0 },
                     open: false
                  })
               }}
            />
         ))}
      </Group>
   )
}

export default Table