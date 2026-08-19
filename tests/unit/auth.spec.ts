import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import LoginPage from '@/views/LoginPage.vue'

describe('LoginPage.vue', () => {
  test('renderiza o formulário de login', () => {
    const wrapper = mount(LoginPage)

    expect(wrapper.text()).toContain('Entrar')
    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Senha')
  })
})
