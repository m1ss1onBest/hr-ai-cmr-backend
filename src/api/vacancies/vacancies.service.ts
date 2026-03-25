import {Injectable} from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Injectable()
export class VacanciesService{
    create (dto: CreateVacancyDto){
        //TODO:
        return {message: 'Vacancy created successfully',...dto } 
    }

    findAll(){
        //TODO:
        return[];
    }

    findOne(id: string){
        //TODO:
        return {id }
    }

    update(id: string, dto: CreateVacancyDto){
        //TODO:
        return {id, ...dto}
    }

    remove(id: string){
        //TODO:
        return {id,deleted: true , massage: 'Vacancy deleted successfully'}
    }

}