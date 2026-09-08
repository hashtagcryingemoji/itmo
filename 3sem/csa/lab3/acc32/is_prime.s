.data

input_addr: .word 0x80
output_addr: .word 0x84
n: .word 0
root: .word 1
divisor: .word 2
const_one: .word 1

.text

.org 0x88

_start:
	load input_addr
	load_acc
	beqz lesser_than_one
	bltz lesser_than_one
	store n
	sub const_one
	beqz is_not_prime	 
		
calc_square:
	load root
	add const_one
	store root
	mul root ;acc = root^2
	bvs loop ; handling root^2 > 2^7-1 case 
	sub n
	bgtz loop
	bltz calc_square
	load root
	add const_one
	store root ; root = floor(sqrt(n)) + 1 

loop:
	load root
	sub divisor
	beqz is_prime
	load n
	rem divisor
	beqz is_not_prime
	load divisor
	add const_one
	store divisor
	jmp loop		

is_not_prime:
	load_imm 0
	store_ind output_addr
	halt

is_prime:
	load_imm 1
	store_ind output_addr
	halt

lesser_than_one:
	load_imm -1
	store_ind output_addr
	halt

