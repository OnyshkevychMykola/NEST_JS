import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Header,
  Redirect, Query, HttpException, BadRequestException, UseFilters, ParseIntPipe, UsePipes, UseGuards, ValidationPipe
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {Query as ExpressQuery} from "express-serve-static-core";
import {HttpExceptionFilter} from "../helpers/http-filter";
import {CustomValidationPipe} from "./pipes/validation.pipes";
import {NumberToStringPipe} from "./pipes/number-to-string.pipes";
import {BeltGuard} from "./guards/belt.guard";
import {Roles} from "./roles.decorator";

@Controller('customers')
export class CustomersController {
  constructor(
      private readonly customersService: CustomersService
  ) {}

  //Casual Call
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

 //Call with HTTP code
  @Post('code')
  @HttpCode(HttpStatus.NO_CONTENT) // @HttpCode(204) ALTERNATIVE
  createWithNewHTTPStatus(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  //Call with Header
  @Post('header')
  @Header('Cache-Control', 'none')
  createWithNewHeader(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  //Call with Redirect
  @Post('redirect')
  @Redirect('https://ya.kinokordon.love/')
  createWithNewRedirect(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  //Get with Params
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('sdsd')
    return this.customersService.findOne(+id);
  }

  //Get with Query
  @Get('query-find/query')
  async findAllWithQuery(@Query() query: ExpressQuery): Promise<ExpressQuery> {
    console.log('dsdd')
    return query;
  }


  //Delete with exception
  @Delete(':id')
  @UseFilters(new HttpExceptionFilter())
  async removeWithException(@Param('id') id: number) {
      // throw new HttpException({
      //   status: HttpStatus.FORBIDDEN,
      //   error: 'This is a custom message',
      // }, HttpStatus.FORBIDDEN );
    throw new BadRequestException('Something bad happened',
        { cause: new Error(), description: 'Some error description' })
  }


  //Using Pipes

  // @Get('/pipes/:id')
  // async findOneWithPipe(@Param('id', ParseIntPipe) id: number) {
  //   return this.customersService.findOne(id);
  // }

  // @UsePipes(CustomValidationPipe)
  @UsePipes(new ValidationPipe())
  @Post('pipes')
  createWithPipe(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get('pipes/:id')
  @UsePipes(NumberToStringPipe)
  async findOneWithPipeTransform(@Param('id') id: number) {
    return id;
  }


  //Using Guards

  @UseGuards(BeltGuard)
  @Post('guards')
  // @UseGuards(BeltGuard)
  @Roles('admin')
  async createWithGuard(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }


}
