// import { ColumnService } from './column.service.js'
import { createColumnSchema, boardIdSchema, columnIdSchema } from './columnJoiSchemas.js'
export class ColumnController {
    constructor(columnService) {
        this.columnService = columnService;
        // this.boardIdSchema = boardIdSchema;
        // this.columnIdSchema = columnIdSchema;
        // this.createColumnSchema = createColumnSchema;
    }

        getColumns = async(req,res,next)=>{
            try{
                // boardId 유효성 검사
                const boardIdError = boardIdSchema.validate(req.parmas)
                if(boardIdError){
                    const error = new Error('주소 형식이 올바르지 않습니다.');
                    error.status = 400;
                    throw error;
                }

                const { boardId } = req.parmas
                const columns = await this.columnService.findAllColumns(boardId)
                
                return res.status(200).json(columns)
                }catch(error){
                    res.status(400).json({ error: error.message });
                }
        }

        createColumn = async(req,res,next) => {
            try{
                // boardId 유효성 검사
                const { boardId } = boardIdSchema.validate(req.params)

                const { columnTitle } = createColumnSchema.validate(req.body);
                // const columnWriterid = req.user.userId

                const columnWriterId = res.locals.user.userId

                const createColumn = await this.columnService.createColumn(
                    boardId,
                    columnTitle,
                    columnWriterId                    
                )
                return res.status(201).json(createColumn)
            }catch(error){
                res.status(400).json({ error: error.message });
            }
        }

        updateColumn = async(req, res, next) => {
            try{
                // boardId 유효성 검사
                const { boardId } = boardIdSchema.validate(req.params)
                // columnId 유효성 검사
                const { columnId } = columnIdSchema.validate(req.params);

                const { columnTitle, columnOrder } = createColumnSchema.validate(req.body);
    
                const columnWriterid = req.user.userId

                const newColumn = await this.columnService.updateColumn(
                    boardId,columnId,columnTitle,columnOrder,columnWriterid
                    )
                return res.status(200).json(newColumn)
            }catch(error){
                res.status(400).json({ error: error.message });
            }
        }

        deleteColumn = async(req,res,next) => {
            try{
        // boardId 유효성 검사
                const { boardId } = boardIdSchema.validate(req.params)
                // columnId 유효성 검사
                const { columnId } = columnIdSchema.validate(req.params);
            
                const deletedColumn = await this.columnService.deletedColumn(
                    boardId,columnId
                )
                return res.status(200).json({message:'삭제완료'})
            }catch(error){
                res.status(400).json({ error: error.message });
            }
        }
}