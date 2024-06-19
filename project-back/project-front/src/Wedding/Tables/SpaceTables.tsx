import Table from "./Table"
import { Stage, Layer, Rect, Circle } from "react-konva";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { IPopoverSeat } from "./AppTables";

export interface ITable {
   id: number;
   name: string;
   maxChairs: number;
   guests: IGuest[];
   pos_x: number;
   pos_y: number;
}
export interface IGuest {
   id: number;
   name: string;
   numSeat: number;
   plusOne: string | null;
   isPlusOne: boolean;
   group: string | null;
}

const SpaceTables = (props: {
   tables: ITable[],
   guest: IGuest | undefined,
   returnGuest: () => void,
   checkOverTables: (p: { x: number, y: number }, g: IGuest, onlyCheck?: boolean) => number,
   updateTable: (table: ITable) => void
   editTable: (table: ITable) => void
   showSeat: (ps: IPopoverSeat) => void
}) => {

   const [patternImage, setPatternImage] = useState< HTMLImageElement | null>(null);
   const stageRef = useRef<Konva.Stage>(null);
   const initialPos = { x: 400, y: 400 }
   // const [over, setOver] = useState(-1)

   useEffect(() => {
      const gridCanvas = createGridPattern(20, '#e0e0e0');
      setPatternImage(gridCanvas);
   }, [props.tables]);

   return (
      <>
         <Stage
            style={{ width: '100%', height: '100%' }}
            ref={stageRef}
            width={window.visualViewport?.width}
            height={window.visualViewport?.height}
            draggable
         >
            <Layer>
               {patternImage && (<>
                  <Rect
                     x={-window.innerWidth * 2}
                     y={-window.innerHeight * 2}
                     width={window.innerWidth * 4}
                     height={window.innerHeight * 4}
                     fillPatternImage={patternImage}
                     fillPatternRepeat="repeat"
                  />
                  {
                     props.tables.map((table, index) => (
                        <Table
                           key={index}
                           data={table}
                           index={index}
                           updateTable={props.updateTable}
                           editTable={props.editTable}
                           showSeat={props.showSeat}
                        // setOver={over === table.id}
                        />
                     ))
                  }
               </>)}
               {props.guest &&
                  <Circle
                     draggable
                     x={initialPos.x}
                     y={initialPos.y}
                     radius={20}
                     fill={'lightgreen'}
                     stroke={'grey'}
                     strokeWidth={1}
                     onMouseEnter={e => {
                        const container = e.target.getStage()!.container();
                        container.style.cursor = "move";
                     }}
                     onMouseLeave={e => {
                        const container = e.target.getStage()!.container();
                        container.style.cursor = "default";
                        props.showSeat({
                           guest: props.guest,
                           position: { x: 0, y: 0 },
                           open: false
                        })
                     }}
                     // onDragMove={(e) => {
                     //    setOver(props.checkOverTables(e.target.absolutePosition(), props.guest!, true))
                     // }}
                     onMouseDown={() => {
                        props.showSeat({
                           guest: props.guest,
                           position: { x: 0, y: 0 },
                           open: false,
                        })
                     }}
                     onMouseOver={(e) => {
                        props.showSeat({
                           guest: props.guest,
                           position: e.target.getAbsolutePosition(),
                           open: true,
                           plusOne: props.guest!.plusOne
                        })
                     }}
                     onDblClick={() => {
                        props.returnGuest()
                     }}
                     onDragEnd={(e) => {
                        props.checkOverTables(e.target.absolutePosition(), props.guest!)
                     }}
                  />
               }
            </Layer>
         </Stage >
      </>
   )
}

export default SpaceTables

const createGridPattern = (size: number, color: string) => {
   const canvas = document.createElement('canvas');
   const context = canvas.getContext('2d');

   if (!context) return null;

   canvas.width = size;
   canvas.height = size;

   context.fillStyle = '#fff';
   context.fillRect(0, 0, size, size);

   context.strokeStyle = color;
   context.lineWidth = 1;
   context.beginPath();
   context.moveTo(size, 0);
   context.lineTo(size, size);
   context.moveTo(0, size);
   context.lineTo(size, size);
   context.stroke();

   const dataURL = canvas.toDataURL();

   // Crear un nuevo elemento de imagen
   const img = new Image();
   img.src = dataURL;

   return img;
};
