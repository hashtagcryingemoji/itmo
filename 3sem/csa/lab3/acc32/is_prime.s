    .data

input_addr:      .word  0x80
output_addr:     .word  0x84
n:               .word  0
divisor:         .word  3
divisor_squared: .word  9
const_one:       .word  1
const_two:       .word  2
is_prime_const:  .word  1
is_not_prime_const: .word  0
lesser_than_one_const: .word  -1

    .text

    .org         0x88

_start:
    load         input_addr
    load_acc
    beqz         lesser_than_one
    bltz         lesser_than_one
    store        n
    sub          const_one
    beqz         is_not_prime
    sub          const_one
    beqz         is_prime
    add          const_two
    rem          const_two
    beqz         is_not_prime


loop:
    load         n
    sub          divisor_squared
    bltz         is_prime
    load         n
    rem          divisor
    beqz         is_not_prime
    load         divisor
    add          const_two
    store        divisor
    mul          divisor
    bvs          is_prime                    ; div > srqt(n)
    store        divisor_squared
    jmp          loop

is_not_prime:
    load         is_not_prime_const
    jmp          output

is_prime:
    load         is_prime_const
    jmp          output

lesser_than_one:
    load         lesser_than_one_const
    jmp          output

output:
    store_ind    output_addr
    halt
